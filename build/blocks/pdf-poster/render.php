<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$pdfp_attributes = $attributes;
$pdfp_attributes['isPremium'] = false;

if (array_key_exists('adobeEmbedder', $pdfp_attributes)) {
    $pdfp_attributes['adobeEmbedder'] = \PDFPro\Helper\PDFP_Functions::pdfp_resolve_viewer($pdfp_attributes['adobeEmbedder']);
}

if (in_array(($pdfp_attributes['adobeEmbedder'] ?? ''), array('flipbook', 'slider'), true)) {
    wp_enqueue_script('dflip-script');
    wp_enqueue_style('dflip-style');
}

$pdfp_id = wp_unique_id('block-');
$pdfp_align = $pdfp_attributes['align'] ?? '';
$pdfp_class_name = $pdfp_attributes['className'] ?? '';


$pdfp_rtl_mode = $pdfp_attributes['rtlMode'] ?? 'off';
$pdfp_is_rtl = ('on' === $pdfp_rtl_mode) || ('auto' === $pdfp_rtl_mode && is_rtl());


$pdfp_theme_mode = $pdfp_attributes['themeMode'] ?? 'light';
$pdfp_theme_attr = in_array($pdfp_theme_mode, array('light', 'dark'), true) ? $pdfp_theme_mode : '';

if (!empty($pdfp_attributes['watermark'])) {
    $pdfp_attributes['watermark'] = \PDFPro\Helper\PDFP_Functions::pdfp_watermark_resolve($pdfp_attributes['watermark'], get_the_ID());
} else {
    $pdfp_attributes['watermark'] = array('enabled' => false);
}

$pdfp_is_watermarked = !empty($pdfp_attributes['watermark']['enabled'])
    && in_array('screen', (array) ($pdfp_attributes['watermark']['apply'] ?? array('screen')), true);

$pdfp_block_class_name = 'wp-block-pdfp-pdf-poster ' . $pdfp_class_name . ' align' . $pdfp_align . ($pdfp_is_rtl ? ' pdfp_rtl' : '') . ($pdfp_is_watermarked ? ' pdfp_watermarked' : '');
$pdfp_popup_options = $pdfp_attributes['popupOptions'] ?? [];
$pdfp_is_popup_enabled = isset($pdfp_popup_options['enabled']) ? $pdfp_popup_options['enabled'] : false;

// Resolve before anything reads it. A block stores an absolute URL captured when the
// file was picked; after a domain change, an HTTPS switch or a clone to staging that URL
// 404s and PDF.js reports it as "Missing PDF file." with no clue why. The resolver
// rebuilds it from the attachment id when the editor recorded one, and otherwise rebases
// a stale uploads URL onto this install -- keeping it only if the file is really there.
$pdfp_attributes['file'] = \PDFPro\Helper\PDFP_Functions::pdfp_resolve_file_url(
    $pdfp_attributes['file'] ?? '',
    $pdfp_attributes['fileId'] ?? 0
);

// Nothing to show: no file, and not an image-gallery flipbook with pages (the same test
// Viewer.js uses for useImagesFlipbook/hasContent). Without this the viewer mounted on an
// empty container and the visitor saw a blank gap. See PDFP_Functions::pdfp_empty_state().
$pdfp_has_images = in_array(($pdfp_attributes['adobeEmbedder'] ?? ''), array('flipbook', 'slider'), true)
    && ($pdfp_attributes['flipbookSourceType'] ?? '') === 'images'
    && count(array_filter((array) ($pdfp_attributes['flipbookImages'] ?? array()))) > 0;
if ('' === trim((string) $pdfp_attributes['file']) && !$pdfp_has_images) {
    $pdfp_empty_w = $pdfp_attributes['width'] ?? '100%';
    echo \PDFPro\Helper\PDFP_Functions::pdfp_empty_state( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
        !empty($pdfp_attributes['posterId']) ? 'poster' : 'block',
        array(
            'width' => is_array($pdfp_empty_w) ? ($pdfp_empty_w['desktop'] ?? '100%') : (string) $pdfp_empty_w,
            'theme' => $pdfp_attributes['themeMode'] ?? 'light',
            'poster_id' => $pdfp_attributes['posterId'] ?? 0,
            'align' => $pdfp_align !== '' ? $pdfp_align : 'none',
            'class' => $pdfp_class_name,
        )
    );
    return;
}

$pdfp_file = $pdfp_attributes['file'];
$pdfp_is_dropbox = strpos($pdfp_file, 'dropbox.com') !== false;

$pdfp_track_doc_key = '';
$pdfp_track_enabled = false;
$pdfp_track_origin = 0;
if (\PDFPro\Helper\PDFP_Functions::pdfp_tracking_enabled() && ($pdfp_attributes['trackingEnabled'] ?? true)) {
    $pdfp_track_doc_key = \PDFPro\Helper\PDFP_Functions::pdfp_doc_key($pdfp_file, $pdfp_attributes['posterId'] ?? 0);
    $pdfp_track_enabled = '' !== $pdfp_track_doc_key;

    $pdfp_track_origin = (int) get_the_ID();
}

$pdfp_block_css = trim((string) ($pdfp_attributes['additional']['CSS'] ?? ''));
if ('' !== $pdfp_block_css) {
    echo '<style>' . wp_strip_all_tags($pdfp_block_css) . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

$pdfp_height = $pdfp_attributes['height'] ?? '400px';
$pdfp_width = $pdfp_attributes['width'] ?? '100%';
$pdfp_alignment = $pdfp_attributes['alignment'] ?? 'left';
$pdfp_protect = $pdfp_attributes['protect'] ?? false;

// Auto Thumbnail. Decided here, once per render, so a page view never renders anything:
// it reads one stored image id. Nothing is looked up unless this embed shows a cover
// (Cover first) or borrows it for an image popup that has none. Protect Content never
// gets one -- a public picture of page 1 is exactly what it exists to prevent.
$pdfp_cover_first = false;
$pdfp_attributes['cover'] = null;
$pdfp_popup_needs_image = !empty($pdfp_popup_options['enabled']) && ($pdfp_popup_options['triggerType'] ?? '') === 'image' && empty($pdfp_popup_options['image']);
if (!$pdfp_protect && class_exists('\PDFPro\Rest\PDFP_Cover')) {
    $pdfp_cover_settings = \PDFPro\Rest\PDFP_Cover::settings();
    $pdfp_cover_first = empty($pdfp_popup_options['enabled']) && \PDFPro\Rest\PDFP_Cover::cover_first_on($pdfp_attributes['coverFirst'] ?? 'default');
    $pdfp_borrow = $pdfp_popup_needs_image && $pdfp_cover_settings['popup'];

    if ($pdfp_cover_first || $pdfp_borrow) {
        $pdfp_images = ($pdfp_attributes['flipbookSourceType'] ?? '') === 'images' ? array_values(array_filter((array) ($pdfp_attributes['flipbookImages'] ?? array()))) : array();
        if ($pdfp_images) {
            // An image-gallery flipbook already has a cover: its first page.
            $pdfp_first = is_array($pdfp_images[0]) ? ($pdfp_images[0]['url'] ?? '') : $pdfp_images[0];
            $pdfp_attributes['cover'] = $pdfp_first ? array('src' => esc_url_raw($pdfp_first)) : null;
        } else {
            $pdfp_pdf_id = \PDFPro\Rest\PDFP_Cover::pdf_id_for($pdfp_file, array($pdfp_attributes['fileId'] ?? 0, $pdfp_attributes['coverPdfId'] ?? 0));
            $pdfp_attributes['cover'] = $pdfp_pdf_id ? \PDFPro\Rest\PDFP_Cover::cover_data($pdfp_pdf_id, (string) ($pdfp_attributes['title'] ?? '')) : null;
        }
        if ($pdfp_borrow && !empty($pdfp_attributes['cover']['src'])) {
            $pdfp_attributes['popupOptions']['image'] = $pdfp_attributes['cover']['src'];
        }
    }
}
$pdfp_attributes['coverFirst'] = $pdfp_cover_first;
// Every cover uses the standard look in this build (cover design is Pro).
$pdfp_attributes['coverStyle'] = $pdfp_cover_first ? \PDFPro\Rest\PDFP_Cover::effective_style() : array();

if ($pdfp_is_dropbox) {
    ?>
    <a data-height="<?php echo esc_attr(is_string($pdfp_height) ? $pdfp_height : ($pdfp_height['desktop'] ?? '400px')) ?>" 
       data-width="<?php echo esc_attr(is_string($pdfp_width) ? $pdfp_width : ($pdfp_width['desktop'] ?? '100%')) ?>"
        href="<?php echo esc_url($pdfp_file) ?>" target="_blank" class="dropbox-embed" rel="noopener noreferrer">Open in new
        tab</a>
    <?php
} else {
    ?>

    <div class='<?php echo esc_attr($pdfp_block_class_name); ?>' id='<?php echo esc_attr($pdfp_id); ?>'
        data-attributes='<?php echo esc_attr(wp_json_encode($pdfp_attributes)); ?>'
        <?php echo $pdfp_is_rtl ? "dir='rtl'" : ''; ?>
        <?php echo $pdfp_theme_attr ? "data-pdfp-theme='" . esc_attr($pdfp_theme_attr) . "'" : ''; ?>
        <?php echo $pdfp_is_watermarked ? "data-pdfp-wm='1'" : ''; ?>
        <?php echo $pdfp_track_enabled ? "data-pdfp-doc='" . esc_attr($pdfp_track_doc_key) . "' data-pdfp-track='1'" : ''; ?>
        <?php echo ($pdfp_track_enabled && $pdfp_track_origin) ? "data-pdfp-origin='" . esc_attr($pdfp_track_origin) . "'" : ''; ?>
        style="text-align: <?php echo esc_attr($pdfp_alignment) ?>">
        <?php if ($pdfp_cover_first) {
            echo \PDFPro\Rest\PDFP_Cover::markup($pdfp_attributes); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
        } elseif (!$pdfp_protect && !$pdfp_is_popup_enabled) {
            $pdfp_p_height = is_string($pdfp_height) ? $pdfp_height : ($pdfp_height['desktop'] ?? '800px');
            $pdfp_p_width = is_string($pdfp_width) ? $pdfp_width : ($pdfp_width['desktop'] ?? '100%');
            ?>
            <div class="pdfp_loading_placeholder"
                style="height: <?php echo esc_attr($pdfp_p_height); ?>; width: <?php echo esc_attr($pdfp_p_width); ?>; display: flex; flex-direction: column; gap: 14px; align-items: center; justify-content: center; background: #f5f5f5; border: 1px solid #ddd;">
                <span class="pdfp_spinner" aria-hidden="true"></span>
                <p style="margin: 0;"><?php esc_html_e('Loading Viewer...', 'pdf-poster'); ?></p>
            </div>
        <?php } ?>
    </div>
<?php
}
