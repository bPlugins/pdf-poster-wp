<?php

namespace PDFPro\Admin;

use PDFPro\Helper\PDFP_Functions as Utils;
use PDFPro\Base\PDFP_EnqueueAssets as Assets;

if (!defined('ABSPATH')) exit;

/**
 * Live Preview for the classic PDF Poster edit screen.
 *
 * A "Preview" button sits beside Save / Update. It opens a modal whose iframe shows the
 * poster as a visitor would see it, rendered from the values CURRENTLY in the metabox --
 * nothing is saved, autosaved or counted.
 *
 * How (same model as Document Embedder's preview): the unsaved `_fpdf[...]` fields are
 * copied into a separate body-level form that POSTs into the iframe at a nonce-protected
 * front-end URL. That request shims the single `_fpdf` postmeta read for this post, then
 * runs the ordinary metabox -> block mapping and render_block(). No rendering code is
 * duplicated, so the preview can never drift from the front end.
 *
 * No Pro twin: PDFP_Init::instantiate() only swaps when a *Pro class exists, and both
 * builds want the same preview. Pro-only attributes are already gated inside
 * Utils::pdfp_block_from_meta(), exactly as on the front end.
 */
if (!class_exists('PDFPro\Admin\PDFP_LivePreview')) {
    class PDFP_LivePreview {

        const POST_TYPE    = 'pdfposter';
        const QUERY_VAR    = 'pdfp_preview';
        const NONCE_ACTION = 'pdfp_preview_';

        /**
         * `_fpdf` keys (top level or nested, e.g. media['url']) that hold URLs.
         */
        const URL_KEYS = ['source', 'url', 'thumbnail'];

        /**
         * Free-form fields that must keep newlines; render.php strips tags on output.
         */
        const RAW_KEYS = ['custom_css'];

        public function register() {
            add_action('admin_enqueue_scripts', [$this, 'enqueue']);
            add_action('admin_footer', [$this, 'print_modal']);
            add_action('template_redirect', [$this, 'maybe_render_preview']);
        }

        /* ---------------------------------------------------------------------------
         * Admin side
         * ------------------------------------------------------------------------ */

        /**
         * Classic editor for a PDF Poster only. A poster edited in the block editor
         * already previews itself in the canvas.
         */
        private function is_classic_poster_screen() {
            if (!function_exists('get_current_screen')) {
                return false;
            }
            $screen = get_current_screen();

            return $screen
                && $screen->base === 'post'
                && $screen->post_type === self::POST_TYPE
                && !(method_exists($screen, 'is_block_editor') && $screen->is_block_editor());
        }

        public function enqueue($hook) {
            if (!in_array($hook, ['post.php', 'post-new.php'], true) || !$this->is_classic_poster_screen()) {
                return;
            }

            // filemtime, not PDFPRO_VER: a CSS/JS tweak between releases must not be served stale.
            $css = 'assets/admin/css/live-preview.css';
            $js  = 'assets/admin/js/live-preview.js';
            wp_enqueue_style('pdfp-live-preview', PDFPRO_PLUGIN_DIR . $css, [], PDFPRO_VER . '.' . (int) @filemtime(PDFPRO_PATH . $css));
            wp_enqueue_script('pdfp-live-preview', PDFPRO_PLUGIN_DIR . $js, ['jquery'], PDFPRO_VER . '.' . (int) @filemtime(PDFPRO_PATH . $js), true);
            wp_localize_script('pdfp-live-preview', 'pdfpLivePreview', [
                'i18n'   => [
                    'updating' => __('Updating…', 'pdf-poster'),
                    'ready'    => __('Live', 'pdf-poster'),
                    'failed'   => __('Could not load the preview. Try Refresh.', 'pdf-poster'),
                ],
            ]);
        }

        /**
         * The modal, the trigger button and the carrier form.
         *
         * All printed at body level: metabox markup lives INSIDE form#post, and a nested
         * <form> is invalid HTML that browsers drop -- taking the post form with it. The
         * button is moved next to Save by the script (WordPress has no hook inside
         * #publishing-action), which is also why it is hidden until then.
         */
        public function print_modal() {
            if (!$this->is_classic_poster_screen()) {
                return;
            }

            global $post;
            $post_id = ($post instanceof \WP_Post) ? (int) $post->ID : 0;
            if (!$post_id) {
                return;
            }

            $devices = [
                'desktop' => __('Desktop', 'pdf-poster'),
                'tablet'  => __('Tablet', 'pdf-poster'),
                'mobile'  => __('Mobile', 'pdf-poster'),
            ];
            ?>
            <button type="button" id="pdfp-preview-trigger" class="button button-large pdfp-preview-trigger" hidden
                    aria-haspopup="dialog" aria-controls="pdfp-preview-modal">
                <?php self::icon('eye', 16); ?>
                <span><?php esc_html_e('Preview', 'pdf-poster'); ?></span>
            </button>

            <form id="pdfp-preview-form" method="post" target="pdfp-preview-frame"
                  action="<?php echo esc_url(self::preview_url($post_id)); ?>"
                  style="display:none" aria-hidden="true"></form>

            <div id="pdfp-preview-modal" class="pdfp-preview-modal" hidden>
                <div class="pdfp-preview-backdrop" data-pdfp-preview-close></div>

                <div class="pdfp-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="pdfp-preview-title">
                    <div class="pdfp-preview-head">
                        <h2 id="pdfp-preview-title" class="pdfp-preview-title">
                            <?php esc_html_e('Live Preview', 'pdf-poster'); ?>
                        </h2>
                        <span class="pdfp-preview-status" aria-live="polite"></span>

                        <div class="pdfp-preview-devices" role="group" aria-label="<?php esc_attr_e('Preview device', 'pdf-poster'); ?>">
                            <?php foreach ($devices as $device => $label) : ?>
                                <button type="button"
                                        class="pdfp-preview-device<?php echo $device === 'desktop' ? ' is-active' : ''; ?>"
                                        data-device="<?php echo esc_attr($device); ?>"
                                        aria-pressed="<?php echo $device === 'desktop' ? 'true' : 'false'; ?>"
                                        title="<?php echo esc_attr($label); ?>">
                                    <?php self::icon($device, 18); ?>
                                    <span class="screen-reader-text"><?php echo esc_html($label); ?></span>
                                </button>
                            <?php endforeach; ?>
                        </div>

                        <div class="pdfp-preview-actions">
                            <button type="button" class="pdfp-preview-icon-btn pdfp-preview-refresh"
                                    title="<?php esc_attr_e('Refresh preview', 'pdf-poster'); ?>">
                                <?php self::icon('refresh', 16); ?>
                                <span class="screen-reader-text"><?php esc_html_e('Refresh preview', 'pdf-poster'); ?></span>
                            </button>
                            <button type="button" class="pdfp-preview-icon-btn pdfp-preview-close" data-pdfp-preview-close
                                    title="<?php esc_attr_e('Close preview', 'pdf-poster'); ?>">
                                <?php self::icon('close', 18); ?>
                                <span class="screen-reader-text"><?php esc_html_e('Close preview', 'pdf-poster'); ?></span>
                            </button>
                        </div>
                    </div>

                    <div class="pdfp-preview-stage" data-device="desktop">
                        <div class="pdfp-preview-viewport">
                            <?php // No src: an initial about:blank navigation would race the first POST. ?>
                            <iframe id="pdfp-preview-frame" name="pdfp-preview-frame"
                                    title="<?php esc_attr_e('PDF Poster live preview', 'pdf-poster'); ?>"></iframe>
                            <div class="pdfp-preview-loading" aria-hidden="true"><span class="pdfp-preview-spinner"></span></div>
                        </div>
                    </div>

                    <p class="pdfp-preview-note">
                        <?php esc_html_e('Showing your unsaved settings as a visitor would see them. Nothing is saved until you press Save or Update.', 'pdf-poster'); ?>
                    </p>
                </div>
            </div>
            <?php
        }

        private static function icon($name, $size) {
            $paths = [
                'eye'     => '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
                'desktop' => '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
                'tablet'  => '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>',
                'mobile'  => '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
                'refresh' => '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
                'close'   => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
            ];
            if (!isset($paths[$name])) {
                return;
            }
            printf(
                '<svg width="%1$d" height="%1$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%2$s</svg>',
                (int) $size,
                $paths[$name] // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup above.
            );
        }

        public static function preview_url($post_id) {
            return add_query_arg(
                [
                    self::QUERY_VAR => 1,
                    'post'          => (int) $post_id,
                    '_wpnonce'      => wp_create_nonce(self::NONCE_ACTION . (int) $post_id),
                ],
                home_url('/')
            );
        }

        /* ---------------------------------------------------------------------------
         * Preview render (front end, inside the iframe)
         * ------------------------------------------------------------------------ */

        public function maybe_render_preview() {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- verified immediately below.
            if (empty($_GET[self::QUERY_VAR])) {
                return;
            }

            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $post_id = isset($_GET['post']) ? absint($_GET['post']) : 0;
            $nonce   = isset($_GET['_wpnonce']) ? sanitize_text_field(wp_unslash($_GET['_wpnonce'])) : '';

            if (!$post_id || !wp_verify_nonce($nonce, self::NONCE_ACTION . $post_id)) {
                self::render_notice(__('This preview link has expired. Reload the editor to keep previewing.', 'pdf-poster'));
            }

            if (get_post_type($post_id) !== self::POST_TYPE || !current_user_can('edit_post', $post_id)) {
                self::render_notice(__('You are not allowed to preview this PDF.', 'pdf-poster'));
            }

            // Unsaved values merged over the saved ones, so a field that is not on screen
            // keeps its stored value.
            // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- nonce verified above; sanitized by sanitize_draft().
            $draft  = self::sanitize_draft(isset($_POST['_fpdf']) ? wp_unslash($_POST['_fpdf']) : []);
            $saved  = get_post_meta($post_id, '_fpdf', true);
            $merged = array_merge(is_array($saved) ? $saved : [], $draft);

            // A field the form rendered but submitted nothing for was genuinely emptied
            // (an unticked checkbox group, say) -- the saved value must not survive.
            foreach (self::rendered_keys() as $key) {
                if (!array_key_exists($key, $draft)) {
                    unset($merged[$key]);
                }
            }

            // Preview as a VISITOR. The author is logged in (usually as an admin), so a
            // "Guests only" or "Everyone except admins" watermark would otherwise vanish
            // from the preview and look broken.
            if (!empty($merged['watermark_audience'])) {
                $merged['watermark_audience'] = 'everyone';
            }

            // Every `_fpdf` read for this post, for this request only, sees the draft.
            $shim = function ($value, $object_id, $meta_key) use ($post_id, $merged) {
                if ((int) $object_id === $post_id && $meta_key === '_fpdf') {
                    return [$merged];
                }
                return $value;
            };
            add_filter('get_post_metadata', $shim, 10, 3);

            // get_the_ID() feeds watermark static tokens ({post_title} etc.).
            $GLOBALS['post'] = get_post($post_id); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
            setup_postdata($GLOBALS['post']);

            // Render BEFORE wp_head(): the renderer enqueues the viewer scripts and (for
            // flipbook engines) dFlip, and they must be queued before the head prints.
            $html = self::render_document($post_id);

            remove_filter('get_post_metadata', $shim, 10);

            self::suppress_admin_bar();

            nocache_headers();
            header('Content-Type: text/html; charset=' . get_option('blog_charset'));
            header('X-Robots-Tag: noindex, nofollow');
            ?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <?php wp_head(); ?>
    <style>
        html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
        html { margin-top: 0 !important; }
        body.pdfp-preview-document { overflow-x: hidden; }
        .pdfp-preview-canvas { box-sizing: border-box; padding: 24px; max-width: 100%; }
        .pdfp-preview-empty { font: 14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #50575e; text-align: center; padding: 80px 24px; border: 1px dashed #c3c4c7; border-radius: 8px; }
    </style>
</head>
<body class="pdfp-preview-document">
    <div class="pdfp-preview-canvas">
        <?php echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- block markup, escaped in render.php. ?>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
            <?php
            exit;
        }

        /**
         * The same metabox -> block mapping the [pdf] shortcode uses, without its
         * post-status gate (a never-saved poster is an auto-draft).
         */
        private static function render_document($post_id) {
            $block = Utils::generate_pdf_poster_block($post_id);

            $is_gallery = ($block['attrs']['flipbookSourceType'] ?? 'pdf') === 'images';
            if (empty($block['attrs']['file']) && !$is_gallery) {
                return '<div class="pdfp-preview-empty">'
                    . esc_html__('Add a PDF file in the configuration below to see the preview.', 'pdf-poster')
                    . '</div>';
            }

            // The title field is part of the same unsaved form.
            // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified in the caller.
            if (isset($_POST['post_title'])) {
                $block['attrs']['title'] = sanitize_text_field(wp_unslash($_POST['post_title']));
            }

            // An author checking their settings is not an audience.
            $block['attrs']['trackingEnabled'] = false;

            Assets::enqueue_viewer_assets();

            return render_block($block);
        }

        /**
         * The preview is a front-end request: keep the admin bar out of the iframe.
         */
        private static function suppress_admin_bar() {
            show_admin_bar(false);
            remove_action('wp_footer', 'wp_admin_bar_render', 1000);
            remove_action('wp_head', '_admin_bar_bump_cb');
            add_action('wp_enqueue_scripts', function () {
                wp_dequeue_style('admin-bar');
                wp_dequeue_script('admin-bar');
            }, 100);
        }

        /**
         * Top-level `_fpdf` keys the metabox rendered, as reported by the script.
         * Only used to detect emptied fields, so anything odd is discarded.
         */
        private static function rendered_keys() {
            // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified in the caller.
            $raw = isset($_POST['pdfp_rendered_keys']) ? sanitize_text_field(wp_unslash($_POST['pdfp_rendered_keys'])) : '';
            if ($raw === '') {
                return [];
            }

            return array_filter(array_map('trim', explode(',', $raw)), function ($key) {
                return $key !== '' && $key !== 'readonly' && preg_match('/^[A-Za-z0-9_-]+$/', $key);
            });
        }

        private static function sanitize_draft($draft) {
            if (!is_array($draft)) {
                return [];
            }

            $clean = [];
            foreach ($draft as $key => $value) {
                if (is_string($key) && !preg_match('/^[A-Za-z0-9_-]+$/', $key)) {
                    continue;
                }
                // Locked free-build fields all post under the id 'readonly'; it is noise.
                if ($key === 'readonly') {
                    continue;
                }

                if (is_array($value)) {
                    $clean[$key] = self::sanitize_draft($value);
                    continue;
                }

                $value = (string) $value;

                if (in_array($key, self::URL_KEYS, true)) {
                    $clean[$key] = esc_url_raw($value);
                } elseif (in_array($key, self::RAW_KEYS, true)) {
                    $clean[$key] = wp_strip_all_tags($value);
                } else {
                    $clean[$key] = sanitize_text_field($value);
                }
            }

            return $clean;
        }

        private static function render_notice($message) {
            nocache_headers();
            status_header(403);
            header('Content-Type: text/html; charset=' . get_option('blog_charset'));
            ?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="robots" content="noindex,nofollow">
    <style>
        body { margin: 0; font: 14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
               color: #50575e; background: #fff; display: flex; align-items: center; justify-content: center;
               min-height: 100vh; padding: 24px; box-sizing: border-box; text-align: center; }
    </style>
</head>
<body class="pdfp-preview-document"><p><?php echo esc_html($message); ?></p></body>
</html>
            <?php
            exit;
        }
    }
}
