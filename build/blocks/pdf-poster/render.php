<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$pdfp_attributes = $attributes;
$pdfp_attributes['isPremium'] = false;

// Adobe and Scroll are premium; FlipBook and Slider need dFlip on disk. Clamp anything
// we can't draw so a value from a Pro export never renders an empty container.
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

// Resolve RTL: 'on' forces it, 'auto' follows the site language (is_rtl()), 'off' (default) leaves the page direction untouched.
$pdfp_rtl_mode = $pdfp_attributes['rtlMode'] ?? 'off';
$pdfp_is_rtl = ('on' === $pdfp_rtl_mode) || ('auto' === $pdfp_rtl_mode && is_rtl());

// Theme: 'light'/'dark' are resolved server-side; 'auto' is resolved client-side (prefers-color-scheme), so leave it unset here.
$pdfp_theme_mode = $pdfp_attributes['themeMode'] ?? 'light';
$pdfp_theme_attr = in_array($pdfp_theme_mode, array('light', 'dark'), true) ? $pdfp_theme_mode : '';

// Watermark: run the same resolver the shortcode path uses, so audience rules and
// static placeholders apply to blocks too. A visitor who shouldn't see a mark never
// receives its config in the markup -- there is nothing for them to un-hide. The
// resolver also clamps this build to the text mark and a free theme, so a value from a
// Pro export degrades instead of rendering a Pro look.
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

$pdfp_file = $pdfp_attributes['file'] ?? '';
$pdfp_is_dropbox = strpos($pdfp_file, 'dropbox.com') !== false;

// Document Insights: STAMP ONLY. Nothing is counted here on purpose -- this file runs
// on a cache miss, so a counter living here would record one view per cache generation
// instead of one per visitor. All the render path does is publish the document's identity
// so the browser can report against it. See includes/rest/class-pdfp-track.php.
$pdfp_track_doc_key = '';
$pdfp_track_enabled = false;
$pdfp_track_origin = 0;
if (\PDFPro\Helper\PDFP_Functions::pdfp_tracking_enabled() && ($pdfp_attributes['trackingEnabled'] ?? true)) {
    $pdfp_track_doc_key = \PDFPro\Helper\PDFP_Functions::pdfp_doc_key($pdfp_file, $pdfp_attributes['posterId'] ?? 0);
    $pdfp_track_enabled = '' !== $pdfp_track_doc_key;

    // The page this embed is sitting on. Only meaningful for a url-keyed document -- a
    // saved poster already names itself -- and it is what lets the report say WHERE an
    // "Embedded file" actually lives. get_the_ID() is false outside a loop, so it is
    // cast rather than trusted.
    $pdfp_track_origin = (int) get_the_ID();
}

// Per-block Custom CSS (block inspector > Additional > CSS, or the poster's Advanced
// section). Printed as a SIBLING of the block container, never inside it: view.js calls
// createRoot() on that container and React replaces its children, so a nested <style> is
// discarded on hydration. wp_strip_all_tags() is what closes the </style> break-out, so
// the rules can be echoed as-is afterwards.
$pdfp_block_css = trim((string) ($pdfp_attributes['additional']['CSS'] ?? ''));
if ('' !== $pdfp_block_css) {
    echo '<style>' . wp_strip_all_tags($pdfp_block_css) . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

$pdfp_height = $pdfp_attributes['height'] ?? '400px';
$pdfp_width = $pdfp_attributes['width'] ?? '100%';
$pdfp_alignment = $pdfp_attributes['alignment'] ?? 'left';
$pdfp_protect = $pdfp_attributes['protect'] ?? false;

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
        <?php if (!$pdfp_protect && !$pdfp_is_popup_enabled) {
            $pdfp_p_height = is_string($pdfp_height) ? $pdfp_height : ($pdfp_height['desktop'] ?? '800px');
            $pdfp_p_width = is_string($pdfp_width) ? $pdfp_width : ($pdfp_width['desktop'] ?? '100%');
            ?>
            <div class="pdfp_loading_placeholder"
                style="height: <?php echo esc_attr($pdfp_p_height); ?>; width: <?php echo esc_attr($pdfp_p_width); ?>; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border: 1px solid #ddd;">
                <p><?php esc_html_e('Loading Viewer...', 'pdf-poster'); ?></p>
            </div>
        <?php } ?>
    </div>
<?php
}
