<?php

namespace PDFPro\Admin;

use PDFPro\Helper\PDFP_Functions as Utils;
use PDFPro\Rest\PDFP_Cover as Cover;

if (!defined('ABSPATH'))
    exit;

if (!class_exists('PDFPro\Admin\PDFP_AutoThumbnail')) {
    class PDFP_AutoThumbnail
    {
        const POST_TYPE = 'pdfposter';
        const BULK_ACTION = 'pdfp_generate_covers';

        public function register()
        {
            // After PDFP_Settings / PDFP_MetaBox (same hook and priority, registered
            // earlier), so these become new sections of the existing screens.
            add_action('init', array($this, 'settings_section'), 0);
            add_action('init', array($this, 'metabox_section'), 0);
            add_action('init', array($this, 'thumbnail_support'), 20);

            if (!is_admin()) {
                return;
            }

            add_action('admin_enqueue_scripts', array($this, 'enqueue'));
            add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor'));

            add_filter('wp_prepare_attachment_for_js', array($this, 'media_thumbnail'), 10, 2);
            add_filter('attachment_fields_to_edit', array($this, 'attachment_field'), 10, 2);

            add_filter('manage_' . self::POST_TYPE . '_posts_columns', array($this, 'columns'), 20);
            add_action('manage_' . self::POST_TYPE . '_posts_custom_column', array($this, 'column'), 10, 2);
            add_filter('bulk_actions-edit-' . self::POST_TYPE, array($this, 'bulk_actions'));
            add_filter('handle_bulk_actions-edit-' . self::POST_TYPE, array($this, 'handle_bulk'), 10, 3);

            add_action('add_meta_boxes_' . self::POST_TYPE, array($this, 'cover_box'));
            add_action('save_post_' . self::POST_TYPE, array($this, 'sync_featured_image'), 20);
        }

        /* ---------------------------------------------------------------------------
         * Settings + metabox
         * ------------------------------------------------------------------------ */

        public function settings_section()
        {
            if (!class_exists('\CSF')) {
                return;
            }

            \CSF::createSection('fpdf_option', array(
                'title' => Utils::pdfp_pro_title(__('Auto Thumbnail', 'pdf-poster'), 'New'),
                'fields' => array(
                    array(
                        'type' => 'subheading',
                        'content' => __('Covers made from a PDF\'s first page, used by every viewer.', 'pdf-poster'),
                    ),
                    array(
                        'id' => 'pdfp_autothumb_enable',
                        'type' => 'switcher',
                        'title' => __('Auto-generate covers', 'pdf-poster'),
                        'default' => true,
                        'desc' => __('Make a cover from the PDF whenever one is uploaded in wp-admin. It runs in your browser, so nothing needs to be installed on the server.', 'pdf-poster'),
                    ),
                    array(
                        'id' => 'pdfp_autothumb_popup',
                        'type' => 'switcher',
                        'title' => __('Use cover as popup image', 'pdf-poster'),
                        'default' => true,
                        'desc' => __('When a popup with an Image trigger has no image of its own, show the cover.', 'pdf-poster'),
                    ),
                    array(
                        'id' => 'pdfp_autothumb_cover_first',
                        'type' => 'switcher',
                        'title' => __('Cover first (site default)', 'pdf-poster'),
                        'default' => false,
                        'desc' => __('Show the cover with an Open button and load the viewer only when it is clicked.', 'pdf-poster'),
                    ),
                    array(
                        // A callback, not a static notice: the poster count is a query, and
                        // sections are built on every request -- this runs only when the
                        // Settings screen is actually drawn.
                        'type' => 'callback',
                        'function' => array($this, 'render_cover_first_notice'),
                    ),
                    array(
                        'type' => 'callback',
                        'function' => array($this, 'bulk_box'),
                    ),
                    // Pro settings are named here, not rendered as inert fields -- the same
                    // ledger every other Pro group in this build uses.
                    Utils::pro_feature_list(array(
                        __('Default Cover Design: background, box height, image fit, width, corners and shadow', 'pdf-poster'),
                        __('Open button design: position, colors, hover colors, font size, radius and padding', 'pdf-poster'),
                        __('Custom cover design per poster and per block', 'pdf-poster'),
                        __('Choose which page becomes the cover', 'pdf-poster'),
                        __('Generated image width (300–3000 px)', 'pdf-poster'),
                        __('WebP covers (smaller files)', 'pdf-poster'),
                    )),
                ),
            ));
        }

       
        public function render_cover_first_notice() {
            echo '<div class="csf-notice csf-notice-info pdfp-cover-first-notice">' . $this->cover_first_notice() . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in cover_first_notice().
        }

        private function cover_first_notice()
        {
            $count = wp_count_posts(self::POST_TYPE);
            $posters = $count ? (int) $count->publish + (int) $count->private : 0;

            $lead = $posters
                ? sprintf(
                    /* translators: %s: number of published PDF Posters */
                    _n('Turning this on changes your existing PDFs too: your %s PDF Poster and every PDF Poster block set to "Site default" will show a cover with an Open button instead of the open viewer.', 'Turning this on changes your existing PDFs too: all %s PDF Posters and every PDF Poster block set to "Site default" will show a cover with an Open button instead of the open viewer.', $posters, 'pdf-poster'),
                    '<strong>' . number_format_i18n($posters) . '</strong>'
                )
                : __('Turning this on changes your existing PDFs too: every PDF Poster and PDF Poster block set to "Site default" will show a cover with an Open button instead of the open viewer.', 'pdf-poster');

            return '<p><strong>' . esc_html__('Applies to your whole site.', 'pdf-poster') . '</strong> ' . wp_kses($lead, array('strong' => array())) . '</p>'
                . '<p>' . esc_html__('"Site default" is the setting every existing PDF has after this update. Popups and PDFs with Protect Content are not affected. To keep one PDF as it is, set its Cover first to Off — in the block\'s Cover panel, or the poster\'s Cover tab.', 'pdf-poster') . '</p>';
        }

        /** Settings > Auto Thumbnail > Existing PDFs. Runs in the browser (auto-thumbnail.js). */
        public function bulk_box()
        {
            $counts = Cover::counts();
            ?>
            <div class="csf-title"><h4><?php esc_html_e('Existing PDFs', 'pdf-poster'); ?></h4></div>
            <div class="csf-fieldset">
                <div id="pdfp-cover-bulk" data-total="<?php echo esc_attr($counts['total']); ?>" data-with="<?php echo esc_attr($counts['withCover']); ?>">
                    <button type="button" class="button button-primary" data-pdfp-bulk-start><?php esc_html_e('Generate missing covers', 'pdf-poster'); ?></button>
                    <progress max="1" value="0"></progress>
                    <span data-pdfp-bulk-label></span>
                </div>
                <div class="csf-desc-text"><?php esc_html_e('Runs in this browser tab, two PDFs at a time. Closing the tab pauses it safely; the next run continues where it stopped.', 'pdf-poster'); ?></div>
            </div>
            <div class="clear"></div>
            <?php
        }

        public function metabox_section()
        {
            if (!class_exists('\CSF')) {
                return;
            }

            \CSF::createSection('_fpdf', array(
                'title' => Utils::pdfp_pro_title(__('Cover', 'pdf-poster'), 'New'),
                'fields' => array(
                    array(
                        'id' => 'cover_first',
                        'type' => 'button_set',
                        'title' => __('Cover first', 'pdf-poster'),
                        'default' => 'default',
                        'options' => array(
                            'default' => __('Site default', 'pdf-poster'),
                            'on' => __('On', 'pdf-poster'),
                            'off' => __('Off', 'pdf-poster'),
                        ),
                        'desc' => __('Show the PDF\'s cover with an Open button; the viewer and the PDF load only when it is clicked. Works with every viewer. Not used with Popup or Protect Content.', 'pdf-poster'),
                    ),
                    array(
                        'id' => 'cover_btn_text',
                        'type' => 'text',
                        'title' => __('Button text', 'pdf-poster'),
                        'placeholder' => __('Open document', 'pdf-poster'),
                        'dependency' => array('cover_first', '!=', 'off'),
                    ),
                    Utils::pro_feature_list(array(
                        __('Custom cover design for this poster: background, size, fit, corners and shadow', 'pdf-poster'),
                        __('Open button design: position, colors, hover colors, font size, radius and padding', 'pdf-poster'),
                    )),
                ),
            ));

            $this->place_cover_tab_before_popup();
        }

        /**
         * Cover first and Popup are the two ways to show something in place of the open
         * viewer, so the Cover tab sits right before Popup instead of after Ads.
         *
         * CSF has no section priority: tabs follow registration order, and this one is
         * registered last (after PDFP_MetaBox, without editing it). CSF reads its section
         * list on init priority 10, so moving it here, on init 0, is in time. If Popup is
         * ever renamed or removed, the tab simply stays at the end.
         */
        private function place_cover_tab_before_popup()
        {
            if (!isset(\CSF::$args['sections']['_fpdf']) || !is_array(\CSF::$args['sections']['_fpdf'])) {
                return;
            }
            $sections = array_values(\CSF::$args['sections']['_fpdf']);
            $cover = count($sections) - 1;

            $has = function (array $section, $id) {
                foreach ((array) ($section['fields'] ?? array()) as $field) {
                    if (($field['id'] ?? '') === $id) {
                        return true;
                    }
                }
                return false;
            };
            if ($cover < 1 || !$has($sections[$cover], 'cover_first')) {
                return;
            }

            foreach ($sections as $i => $section) {
                if ($i !== $cover && $has($section, 'popup')) {
                    $moved = array_splice($sections, $cover, 1);
                    array_splice($sections, $i, 0, $moved);
                    \CSF::$args['sections']['_fpdf'] = $sections;
                    return;
                }
            }
        }

        /** Covers double as the poster's featured image (themes, REST featured_media). */
        public function thumbnail_support()
        {
            add_post_type_support(self::POST_TYPE, 'thumbnail');
        }

        /* ---------------------------------------------------------------------------
         * Assets
         * ------------------------------------------------------------------------ */

        private function config(array $extra = array())
        {
            $settings = Cover::settings();
            return array_merge(array(
                'rest' => esc_url_raw(rest_url('pdfp/v1/')),
                'nonce' => wp_create_nonce('wp_rest'),
                'pdfjs' => PDFPRO_PLUGIN_DIR . 'assets/pdfjs-new/generic-legacy/pdf.js',
                'worker' => PDFPRO_PLUGIN_DIR . 'assets/pdfjs-new/generic-legacy/pdf.worker.js',
                'auto' => $settings['enabled'] && current_user_can('upload_files'),
                'coverFirstDefault' => $settings['coverFirst'],
                'settingsUrl' => current_user_can('manage_options') ? admin_url('edit.php?post_type=pdfposter&page=fpdf-settings') : '',
                'page' => $settings['page'],
                'width' => $settings['width'],
                'format' => $settings['format'],
                'bulk' => array(),
                'i18n' => array(
                    'checking' => __('Checking…', 'pdf-poster'),
                    'making' => __('Making cover…', 'pdf-poster'),
                    /* translators: %d: page number */
                    'madeFrom' => __('Made automatically from page %d', 'pdf-poster'),
                    'chosen' => __('Chosen by you', 'pdf-poster'),
                    'removed' => __('Removed. No cover is made for this PDF.', 'pdf-poster'),
                    'waiting' => __('Waiting to make a cover…', 'pdf-poster'),
                    'none' => __('No cover yet.', 'pdf-poster'),
                    'unreadable' => __('This PDF could not be read from the browser.', 'pdf-poster'),
                    'password' => __('This PDF is password protected.', 'pdf-poster'),
                    'invalid' => __('This file does not look like a valid PDF.', 'pdf-poster'),
                    'timeout' => __('Reading this PDF took too long.', 'pdf-poster'),
                    'failed' => __('The cover could not be made.', 'pdf-poster'),
                    'regenerate' => __('Regenerate', 'pdf-poster'),
                    'make' => __('Make cover', 'pdf-poster'),
                    'replace' => __('Replace…', 'pdf-poster'),
                    'remove' => __('Remove', 'pdf-poster'),
                    'chooseCover' => __('Choose a cover image', 'pdf-poster'),
                    'useImage' => __('Use as cover', 'pdf-poster'),
                    'bulkStart' => __('Generate missing covers', 'pdf-poster'),
                    'pause' => __('Pause', 'pdf-poster'),
                    /* translators: 1: PDFs with a cover, 2: all PDFs */
                    'counts' => __('%1$d of %2$d PDFs have a cover', 'pdf-poster'),
                    'allDone' => __('Every PDF that can have a cover has one.', 'pdf-poster'),
                    /* translators: 1: done, 2: total */
                    'bulkProgress' => __('Making covers: %1$d of %2$d done', 'pdf-poster'),
                    'bulkDone' => __('Covers are ready.', 'pdf-poster'),
                ),
            ), $extra);
        }

        private function enqueue_assets(array $extra = array())
        {
            if (!current_user_can('upload_files')) {
                return;
            }
            wp_enqueue_style('pdfp-auto-thumbnail', PDFPRO_PLUGIN_DIR . 'assets/admin/css/auto-thumbnail.css', array(), PDFPRO_VER);
            wp_enqueue_script('pdfp-auto-thumbnail', PDFPRO_PLUGIN_DIR . 'assets/admin/js/auto-thumbnail.js', array(), PDFPRO_VER, true);
            wp_localize_script('pdfp-auto-thumbnail', 'pdfpCoverConfig', $this->config($extra));
        }

        /**
         * Only where PDFs are uploaded or covers are managed: any screen with the media
         * modal, the Media Library, the posters list and the plugin's Settings.
         */
        public function enqueue($hook)
        {
            $screen = function_exists('get_current_screen') ? get_current_screen() : null;
            $id = $screen ? $screen->id : '';

            $extra = array();
            if ('edit-' . self::POST_TYPE === $id && !empty($_GET['pdfp_covers'])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
                $extra['bulk'] = array_values(array_filter(array_map('absint', explode(',', sanitize_text_field(wp_unslash($_GET['pdfp_covers'])))))); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            }

            $wanted = in_array($hook, array('upload.php', 'post.php', 'post-new.php'), true)
                || 'edit-' . self::POST_TYPE === $id
                || false !== strpos($id, 'fpdf-settings');

            if ($wanted) {
                $this->enqueue_assets($extra);
            }
        }

        /** The block editor, on any post type (the block can be used anywhere). */
        public function enqueue_block_editor()
        {
            $this->enqueue_assets();
        }

        /* ---------------------------------------------------------------------------
         * Media Library
         * ------------------------------------------------------------------------ */

        /** The grid draws data.image for a document: give PDFs their cover. */
        public function media_thumbnail($response, $attachment)
        {
            if (empty($response['id']) || !in_array($response['mime'] ?? '', array('application/pdf', 'application/x-pdf'), true)) {
                return $response;
            }
            $cover = Cover::cover_id($response['id']);
            if (!$cover) {
                return $response;
            }
            $src = wp_get_attachment_image_src($cover, 'medium');
            if ($src) {
                $response['image'] = array('src' => $src[0], 'width' => (int) $src[1], 'height' => (int) $src[2]);
                $response['pdfpCover'] = (int) $cover;
            }
            return $response;
        }

        /** "PDF Poster cover" row in attachment details (modal and Edit Media screen). */
        public function attachment_field($fields, $post)
        {
            if (!Cover::is_pdf($post->ID) || !current_user_can('upload_files')) {
                return $fields;
            }
            $fields['pdfp_cover'] = array(
                'label' => __('PDF Poster cover', 'pdf-poster'),
                'input' => 'html',
                'html' => sprintf('<div class="pdfp-cover-field" data-pdfp-cover-field data-id="%d"></div>', (int) $post->ID),
                'show_in_edit' => true,
                'show_in_modal' => true,
            );
            return $fields;
        }

        /* ---------------------------------------------------------------------------
         * All PDF Posters
         * ------------------------------------------------------------------------ */

        /** The PDF a poster shows, from its saved URL (cached lookup). */
        private function poster_pdf_id($poster_id)
        {
            $meta = get_post_meta($poster_id, '_fpdf', true);
            if (!is_array($meta)) {
                return 0;
            }
            $url = Utils::pdfp_resolve_file_url($meta['source'] ?? '', (int) ($meta['source_id'] ?? 0));
            return Cover::pdf_id_for($url, array((int) ($meta['source_id'] ?? 0)));
        }

        public function columns($columns)
        {
            $out = array();
            foreach ($columns as $key => $label) {
                $out[$key] = $label;
                if ('cb' === $key) {
                    $out['pdfp_cover'] = __('Cover', 'pdf-poster');
                }
            }
            if (!isset($out['pdfp_cover'])) {
                $out = array('pdfp_cover' => __('Cover', 'pdf-poster')) + $out;
            }
            return $out;
        }

        public function column($column, $post_id)
        {
            if ('pdfp_cover' !== $column) {
                return;
            }
            $pdf_id = $this->poster_pdf_id($post_id);
            if (!$pdf_id) {
                echo '<span class="pdfp-cover-field__thumb" title="' . esc_attr__('No cover: the PDF is not in the Media Library.', 'pdf-poster') . '"><span class="pdfp-cover-field__doc">PDF</span></span>';
                return;
            }
            // Passive: a list page shows covers, it does not start making them.
            printf('<div class="pdfp-cover-field" data-pdfp-cover-field data-passive data-compact data-id="%d"></div>', (int) $pdf_id);
        }

        public function bulk_actions($actions)
        {
            if (current_user_can('upload_files')) {
                $actions[self::BULK_ACTION] = __('Generate covers', 'pdf-poster');
            }
            return $actions;
        }

        /** Hands the PDFs to the browser, which makes the covers on the next screen. */
        public function handle_bulk($redirect, $action, $post_ids)
        {
            if (self::BULK_ACTION !== $action || !current_user_can('upload_files')) {
                return $redirect;
            }
            $pdfs = array();
            foreach ((array) $post_ids as $poster_id) {
                $pdf_id = $this->poster_pdf_id((int) $poster_id);
                if ($pdf_id && current_user_can('edit_post', $pdf_id)) {
                    // A bulk request is an explicit ask: clear an old failure so it is retried.
                    delete_post_meta($pdf_id, Cover::META_ERROR);
                    $pdfs[$pdf_id] = $pdf_id;
                }
            }
            return add_query_arg('pdfp_covers', implode(',', array_slice(array_values($pdfs), 0, 200)), remove_query_arg('pdfp_covers', $redirect));
        }

        /* ---------------------------------------------------------------------------
         * Poster edit screen
         * ------------------------------------------------------------------------ */

        public function cover_box()
        {
            // The Cover box shows the same image with its controls; core's Featured image
            // box beside it would be a second, conflicting way to set it.
            remove_meta_box('postimagediv', self::POST_TYPE, 'side');
            add_meta_box('pdfp_cover_box', __('Cover', 'pdf-poster'), array($this, 'render_cover_box'), self::POST_TYPE, 'side', 'default');
        }

        public function render_cover_box($post)
        {
            $pdf_id = $this->poster_pdf_id($post->ID);
            if (!$pdf_id) {
                echo '<p class="description">' . esc_html__('Choose a PDF from your Media Library in "PDF Source" and save: its cover appears here. PDFs from other sites show a plain PDF card.', 'pdf-poster') . '</p>';
                return;
            }
            printf('<div class="pdfp-cover-field" data-pdfp-cover-field data-id="%d"></div>', (int) $pdf_id);
            echo '<p class="description">' . esc_html__('Also used as this poster\'s featured image, and as the popup image when the popup has none.', 'pdf-poster') . '</p>';
        }

        /** A poster's featured image follows its PDF's cover, unless someone set another. */
        public function sync_featured_image($poster_id)
        {
            if (wp_is_post_revision($poster_id) || wp_is_post_autosave($poster_id)) {
                return;
            }
            $pdf_id = $this->poster_pdf_id($poster_id);
            $cover = $pdf_id ? Cover::cover_id($pdf_id) : 0;
            $current = (int) get_post_thumbnail_id($poster_id);

            if ($cover && (!$current || (int) get_post_meta($current, Cover::META_OF, true))) {
                set_post_thumbnail($poster_id, $cover);
            }
        }
    }
}
