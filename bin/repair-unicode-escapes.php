<?php
if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('PDFPro\Helper\PDFP_Functions')) {
    echo "PDF Poster is not active on this site -- activate it and run again.\n";
    return;
}

$pdfp_apply = in_array('apply', (array) ($args ?? []), true);

/**
 * Turn a run of backslash-less "uXXXX" escapes back into the characters they encode.
 *
 * Decoded a whole run at a time rather than escape by escape, so a surrogate pair (an
 * emoji in a filename) recombines into one character instead of two unpaired halves.
 * Mirrors PDFP_Functions::pdfp_unmangle_json_escapes().
 */
$pdfp_unmangle = static function ($text) {
    if (!is_string($text) || !preg_match('/u[0-9a-fA-F]{4}/', $text)) {
        return $text;
    }

    return preg_replace_callback(
        '/(?:u[0-9a-fA-F]{4})+/',
        static function ($matches) {
            $json = json_decode('"' . preg_replace('/u([0-9a-fA-F]{4})/', '\\\\u$1', $matches[0]) . '"');

            // A lone surrogate decodes to null; leaving the run untouched is the safe answer.
            return is_string($json) ? $json : $matches[0];
        },
        $text
    );
};

/** Walk every string in the attribute tree. */
$pdfp_walk = static function ($value) use (&$pdfp_walk, $pdfp_unmangle) {
    if (is_string($value)) {
        return $pdfp_unmangle($value);
    }
    if (is_array($value)) {
        return array_map($pdfp_walk, $value);
    }
    return $value;
};

global $wpdb;

// Only posts that hold a pdfp block AND carry something of the broken shape. Both the
// page the block sits on and the pdfposter CPT that a saved poster lives in qualify.
$pdfp_rows = $wpdb->get_results(
    "SELECT ID, post_title, post_content FROM {$wpdb->posts}
      WHERE post_status NOT IN ('trash', 'auto-draft')
        AND post_content LIKE '%wp:pdfp/pdfposter%'
        AND post_content REGEXP 'u0[0-9a-fA-F]{3}'",
    ARRAY_A
);

if (empty($pdfp_rows)) {
    echo "Nothing to repair: no pdfp/pdfposter block contains a stripped unicode escape.\n";
    return;
}

$pdfp_posts_changed = 0;
$pdfp_blocks_changed = 0;

foreach ($pdfp_rows as $pdfp_row) {
    $pdfp_id = (int) $pdfp_row['ID'];
    $pdfp_blocks_here = 0;

    // Rewrites only the attribute JSON of a pdfp/pdfposter opening delimiter. Prose,
    // other plugins' blocks and this block's own inner HTML are never in range.
    $pdfp_new_content = preg_replace_callback(
        '/(<!--\s+wp:pdfp\/pdfposter\s+)(\{.*?\})(\s+\/?-->)/s',
        static function ($matches) use (&$pdfp_blocks_here, $pdfp_walk) {
            $attrs = json_decode($matches[2], true);
            if (!is_array($attrs)) {
                return $matches[0];
            }

            $file = isset($attrs['file']) && is_string($attrs['file']) ? $attrs['file'] : '';
            if ('' === $file || !preg_match('/u[0-9a-fA-F]{4}/', $file)) {
                return $matches[0];
            }

            // The proof. pdfp_resolve_file_url() only returns something different when
            // it found the real file -- by attachment id, or by finding the un-escaped
            // name on disk. Anything else leaves the block alone.
            $resolved = \PDFPro\Helper\PDFP_Functions::pdfp_resolve_file_url(
                $file,
                isset($attrs['fileId']) ? (int) $attrs['fileId'] : 0
            );

            if ($resolved === $file) {
                return $matches[0];
            }

            $attrs = $pdfp_walk($attrs);
            $attrs['file'] = $resolved;

            $pdfp_blocks_here++;

            return $matches[1] . serialize_block_attributes($attrs) . $matches[3];
        },
        $pdfp_row['post_content']
    );

    if (null === $pdfp_new_content || 0 === $pdfp_blocks_here) {
        continue;
    }

    $pdfp_posts_changed++;
    $pdfp_blocks_changed += $pdfp_blocks_here;

    printf(
        "%s #%d (%s) -- %d block%s\n",
        $pdfp_apply ? 'REPAIRED' : 'would repair',
        $pdfp_id,
        $pdfp_row['post_title'],
        $pdfp_blocks_here,
        1 === $pdfp_blocks_here ? '' : 's'
    );

    if (!$pdfp_apply) {
        continue;
    }

    // wp_slash is the whole point: wp_insert_post() unslashes what it is given, and
    // handing it raw JSON is exactly the mistake that caused this in the first place.
    $pdfp_result = wp_update_post(
        wp_slash(array('ID' => $pdfp_id, 'post_content' => $pdfp_new_content)),
        true
    );

    if (is_wp_error($pdfp_result)) {
        printf("  !! failed: %s\n", $pdfp_result->get_error_message());
    }
}

if (0 === $pdfp_posts_changed) {
    // Reached both when nothing was mangled and when something was but is unrecoverable
    // -- the file is genuinely gone -- because neither licenses touching the block.
    echo "Nothing to repair: no block's file URL could be proved mangled. A repair needs\n"
       . "the real file on disk, or an attachment id that resolves it.\n";
    return;
}

printf(
    "\n%s %d block%s across %d post%s.%s\n",
    $pdfp_apply ? 'Repaired' : 'Would repair',
    $pdfp_blocks_changed,
    1 === $pdfp_blocks_changed ? '' : 's',
    $pdfp_posts_changed,
    1 === $pdfp_posts_changed ? '' : 's',
    $pdfp_apply ? '' : ' Re-run with `apply` to write them.'
);
