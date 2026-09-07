<?php
namespace PDFPro\Helper;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if (!class_exists('PDFPro\Helper\PDFP_Functions')) {
    class PDFP_Functions {

        protected static $meta = null;

        public static function i($array, $key1, $key2 = '', $default = false) {
            if (isset($array[$key1][$key2])) {
                return $array[$key1][$key2];
            } else if (isset($array[$key1])) {
                return $array[$key1];
            }
            return $default;
        }

        public static function isset($array, $key1, $default = false) {
            if (isset($array[$key1])) {
                return $array[$key1];
            }
            return $default;
        }

        public static function meta($id, $key, $default = null, $true = false) {
            $meta = metadata_exists('post', $id, '_fpdf') ? get_post_meta($id, '_fpdf', true) : '';
            if (isset($meta[$key]) && $meta != '') {
                if ($true == true) {
                    if ($meta[$key] == '1') {
                        return true;
                    } else if ($meta[$key] == '0') {
                        return false;
                    }
                } else {
                    return $meta[$key];
                }
            } else {
                return $default;
            }
        }

        /**
         * scrambel data removed (premium only)
         */
        public static function scramble__premium_only($do = 'encode', $data = '') {
            return $data;
        }

        /**
         * Detect Browser
         */
        public static function getBrowser() {
            $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
            $browser = "N/A";
            $browsers = array(
                '/msie/i' => 'Internet explorer',
                '/firefox/i' => 'Firefox',
                '/safari/i' => 'Safari',
                '/chrome/i' => 'Chrome',
                '/edge/i' => 'Edge',
                '/Edg/i' => 'Edge',
                '/opera/i' => 'Opera',
                '/mobile/i' => 'Mobile browser'
            );

            foreach ($browsers as $regex => $value) {
                if (preg_match($regex, $user_agent)) {
                    $browser = $value;
                }
            }

            return $browser;
        }

        public static function generate_pdf_poster_block($id) {

            if (!function_exists('pdfp__get_post_meta')) {
                return [
                    'blockName' => 'pdfp/pdfposter',
                ];
            }

            $meta = pdfp__get_post_meta($id, '_fpdf', true);

            $height = $meta('height', ['height' => 1122, 'unit' => 'px']);
            $width = $meta('width', ['width' => 100, 'unit' => '%']);
            $height_tablet = $meta('height_tablet', ['height' => 700, 'unit' => 'px']);
            $height_mobile = $meta('height_mobile', ['height' => 400, 'unit' => 'px']);
            $width_tablet = $meta('width_tablet', ['width' => 100, 'unit' => '%']);
            $width_mobile = $meta('width_mobile', ['width' => 100, 'unit' => '%']);

            $responsive_height = [
                'desktop' => $height['height'] . $height['unit'],
                'tablet' => $height_tablet['height'] . $height_tablet['unit'],
                'mobile' => $height_mobile['height'] . $height_mobile['unit'],
            ];

            $responsive_width = [
                'desktop' => $width['width'] . $width['unit'],
                'tablet' => $width_tablet['width'] . $width_tablet['unit'],
                'mobile' => $width_mobile['width'] . $width_mobile['unit'],
            ];

            $attrs = [
                'uniqueId' => wp_unique_id('pdf-poster'),
                'posterId' => (int) $id,
                'file' => $meta('source', ''),
                'title' => get_the_title($id),
                'height' => $responsive_height,
                'width' => $responsive_width,
                'print' => $meta('print', false, true),
                'showName' => $meta('show_filename', '1', true),
                'downloadButton' => $meta('show_download_btn', false, true),
                'downloadButtonText' => $meta('download_btn_text', 'Download File'),
                'fullscreenButton' => $meta('view_fullscreen_btn', '1', true),
                'fullscreenButtonText' => $meta('fullscreen_btn_text', 'View Fullscreen'),
                'newWindow' => $meta('new_window', false, true),
                'actionsPosition' => $meta('actions_position', 'top'),
                'protect' => $meta('protect', false, true),
                'keyboardNav' => $meta('keyboard_nav', false, true),
                'rtlMode' => $meta('rtl_mode', 'off'),
                'themeMode' => $meta('theme_mode', 'light'),
                'annotationMode' => $meta('annotation_mode', true, true),
                'openLinksInNewTab' => $meta('open_links_in_new_tab', false, true),
                'progressiveLoading' => $meta('progressive_loading', true, true),
                'defaultBrowser' => $meta('default_browser', false, true),
                'adobeEmbedder' => self::pdfp_resolve_viewer($meta('viewer', 'default', false)),
                'flipbookSourceType' => $meta('flipbook_source_type', 'pdf', false),
                'flipbookSound' => $meta('flipbook_sound', true, true),
            ];

            // CSF gallery stores comma-separated attachment IDs; convert to URLs for the flipbook image pages.
            $fb_images_raw = $meta('flipbook_images', '', false);
            $fb_image_urls = [];
            if (!empty($fb_images_raw)) {
                $fb_ids = is_array($fb_images_raw) ? $fb_images_raw : explode(',', $fb_images_raw);
                foreach ($fb_ids as $fb_img_id) {
                    $fb_img_id = (int) trim($fb_img_id);
                    if (!$fb_img_id) {
                        continue;
                    }
                    $fb_img_url = wp_get_attachment_image_url($fb_img_id, 'full');
                    if ($fb_img_url) {
                        $fb_image_urls[] = $fb_img_url;
                    }
                }
            }
            $attrs['flipbookImages'] = $fb_image_urls;

            $popupBtnPadding = $meta('popup_btn_padding', ["top" => 10, "right" => 20, "bottom" => 10, "left" => 20]);
            $attrs['btnStyles'] = [
                "background" => $meta('popup_btn_bg', '#1e73be'),
                "color" => $meta('popup_btn_color', '#ffffff'),
                "fontSize" => $meta('popup_btn_font_size', 1) . 'rem',
                "padding" => $popupBtnPadding
            ];

            // Advanced (metabox > Advanced): the class lands on the viewer wrapper and the
            // CSS is printed beside the block container by render.php.
            $attrs['additional'] = [
                'ID' => '',
                'Class' => $meta('custom_class', '', false),
                'CSS' => $meta('custom_css', '', false),
            ];

            // Popup / lightbox trigger (metabox > Popup). btnStyles is built above because
            // popupOptions carries a copy of it.
            $popup_image_height = $meta('popup_image_height', ['height' => 200, 'unit' => 'px']);
            $popup_image_width = $meta('popup_image_width', ['width' => 300, 'unit' => 'px']);
            $popup_image = $meta('popup_image', []);
            $popup_image = is_array($popup_image) ? ($popup_image['url'] ?? '') : $popup_image;

            $attrs['popupOptions'] = [
                "enabled" => $meta('popup', 0, true),
                "text" => $meta('popup_btn_text', 'Open PDF'),
                "triggerType" => $meta('popup_trigger_type', 'button'),
                "image" => $popup_image,
                "imageHeight" => $popup_image_height['height'] . $popup_image_height['unit'],
                "imageWidth" => $popup_image_width['width'] . $popup_image_width['unit'],
                "imagePdfIcon" => $meta('popup_image_pdf_icon', true, true),
                "triggerAlignment" => $meta('popup_trigger_alignment', 'center'),
                "btnStyle" => $attrs['btnStyles']
            ];

            // Watermark (metabox > Watermark & Branding). Resolved here rather than mapped
            // raw: pdfp_watermark_resolve() applies the audience rule, expands the static
            // placeholders and clamps this build to the text mark and a free theme, so a
            // poster imported from Pro degrades instead of rendering a Pro look.
            // CSF's upload field returns an array, the same unwrapping popup_image needs.
            $wm_image = $meta('watermark_image', []);
            $attrs['watermark'] = self::pdfp_watermark_resolve([
                'enabled'    => $meta('watermark_enable', false, true),
                'markType'   => $meta('watermark_type', 'text', false),
                'theme'      => $meta('watermark_theme', 'confidential', false),
                'text'       => $meta('watermark_text', 'CONFIDENTIAL', false),
                'image'      => is_array($wm_image) ? ($wm_image['url'] ?? '') : $wm_image,
                'imageStyle' => $meta('watermark_image_style', 'grayscale', false),
                'color'      => $meta('watermark_color', '#808080', false),
                'coverage'   => $meta('watermark_coverage', 'normal', false),
                'position'   => $meta('watermark_position', 'center', false),
                'strength'   => $meta('watermark_strength', 'subtle', false),
                'size'       => $meta('watermark_size', 'medium', false),
                'angle'      => $meta('watermark_angle', 'diagonal', false),
                'apply'      => (array) $meta('watermark_apply', ['screen'], false),
                'pages'      => $meta('watermark_pages', 'all', false),
                'audience'   => $meta('watermark_audience', 'everyone', false),
                'antileak'   => $meta('watermark_antileak', false, true),
                'stamp'      => $meta('watermark_stamp', false, true),
                'lock'       => $meta('watermark_lock', false, true),
            ], $id);

            $attrs['socialShare'] = [
                'enabled' => $meta('social_share', false, true),
                'facebook' => $meta('social_share_facebook', true, true),
                'twitter' => $meta('social_share_twitter', true, true),
                'linkedin' => $meta('social_share_linkedin', true, true),
                'pinterest' => $meta('social_share_pinterest', true, true),
                'mailto' => $meta('social_share_mailto', true, true),
                'position' => $meta('social_share_position', 'top', false),
            ];

            return [
                "blockName" => "pdfp/pdfposter",
                "attrs" => $attrs
            ];
        }

        public function isUnsupportedDevice() {
            $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';

            // Detect iPad
            $isIPad = stripos($userAgent, 'iPad') !== false;

            // Detect iPhone 6
            $isIPhone6 = stripos($userAgent, 'iPhone') !== false &&
                isset($_SERVER['HTTP_USER_AGENT']) &&
                preg_match('/iPhone OS [0-10]\/', $userAgent) && // Adjust for iOS versions
                stripos($userAgent, '375x667') !== false;

            if ($isIPad) {
                return true;
            } elseif ($isIPhone6) {
                return true;
            } else {
                return false;
            }
        }

        public static function pdfp_pro_title($title, $badge = 'PRO') {

            if ($badge == 'New') {
                return '
                <div class="pdfp-field-title">
                    <h4>' . esc_html($title) . '</h4>
                    <span class="pdfp-new-badge">' . esc_html($badge) . '</span>
                </div>
            ';
            } else {
                return '
                <div class="pdfp-field-title">
                    <h4>' . esc_html($title) . '</h4>
                    <span class="pdfp-pro-badge">' . esc_html($badge) . '</span>
                </div>
            ';
            }
        }

        public static function pdfp_new_badge($label = 'NEW') {
            return '<span class="pdfp-new-badge">' . esc_html($label) . '</span>';
        }


        /**
         * Put a badge on an admin submenu entry that is already registered.
         *
         * The Analytics entry can badge itself because it calls add_submenu_page()
         * directly and WordPress prints submenu titles unescaped -- the same reason
         * core's own update-count bubbles work. Settings cannot: it is created by
         * CSF::createOptions(), and CSF runs esc_attr() over `menu_title`
         * (vendor/codestar-framework/classes/admin-options.class.php, add_admin_menu()),
         * so markup passed there shows up in the sidebar as literal escaped HTML.
         *
         * Rewriting $submenu after the menu is built is therefore the only route. Run it
         * on admin_menu at a priority above everything that registers a page (CSF is 10,
         * PDFP_AdminLoader::adminMenu is 15).
         *
         * Only index 0 is touched -- the menu label. Index 3, the page title CSF already
         * escaped, is left alone so the browser tab and screen heading stay plain text.
         *
         * @param string $parent_slug Parent menu slug, e.g. 'edit.php?post_type=pdfposter'.
         * @param string $menu_slug   Slug of the submenu entry to badge.
         * @param string $title_html  Replacement label. Printed unescaped -- build it here,
         *                            never from request data.
         * @return bool Whether a matching entry was found.
         */
        public static function pdfp_badge_submenu($parent_slug, $menu_slug, $title_html)
        {
            if (empty($GLOBALS['submenu'][$parent_slug]) || !is_array($GLOBALS['submenu'][$parent_slug])) {
                return false;
            }

            foreach ($GLOBALS['submenu'][$parent_slug] as $index => $item) {
                if (isset($item[2]) && $item[2] === $menu_slug) {
                    $GLOBALS['submenu'][$parent_slug][$index][0] = $title_html;
                    return true;
                }
            }

            return false;
        }

        /**
         * Standalone PRO badge for a single locked option inside an otherwise usable field.
         */
        public static function pdfp_pro_badge($label = 'PRO') {
            return '<span class="pdfp-pro-badge">' . esc_html($label) . '</span>';
        }



        /**
         * Is the dFlip flipbook engine available in this build?
         *
         * The FlipBook / Slider / Scroll viewers all depend on assets/dflip. Kept as a
         * capability check rather than a hard-coded true so a package built without the
         * engine degrades to the bundled PDF.js viewer instead of rendering nothing.
         */
        public static function pdfp_has_flipbook_engine() {
            static $has = null;

            if ($has === null) {
                $has = file_exists(PDFPRO_PATH . 'assets/dflip/js/dflip.min.js');
            }

            return $has;
        }

        /**
         * Resolve the viewer engine, enforcing capability server-side.
         *
         * FlipBook and Slider are free, but they render through dFlip, so they are only
         * honoured when that engine is on disk. Adobe needs the premium PDF Embed bridge
         * and Scroll is premium-only; both fall back to the bundled PDF.js viewer so a
         * value carried over from a Pro export can never render an empty container.
         */
        public static function pdfp_resolve_viewer($viewer) {
            if ($viewer === true) {
                $viewer = 'adobe';
            } elseif ($viewer === false || $viewer === '' || $viewer === null) {
                $viewer = 'default';
            }

            if (in_array($viewer, array('flipbook', 'slider'), true) && self::pdfp_has_flipbook_engine()) {
                return $viewer;
            }

            return 'default';
        }


        /**
         * Where every "go Pro" link in the admin points.
         *
         * Pricing is a route inside the dashboard SPA, not a menu page of its own, so the
         * link is the dashboard screen plus a hash -- admin.php?page=pdf-poster-pricing
         * is not a registered page and lands on "You do not have sufficient permissions".
         * One accessor so the route only has to be corrected in one place if it moves
         * again; the JS side's copy lives in src/blocks/pdf-poster/utils.js.
         */
        public static function pricing_url() {
            return admin_url('edit.php?post_type=pdfposter&page=pdf-poster#/pricing');
        }

        public static function upgrade_section() {
            return array(
                'type' => 'content',
                'content' => '<div class="pdfp-metabox-upgrade-section">' . esc_html__('The Ultimate PDF Embedder Plugin for WordPress, Loved by Over 20,000+ Users.', 'pdf-poster') . ' <a class="button button-bplugins" href="' . esc_url(self::pricing_url()) . '">' . esc_html__('Upgrade to PRO', 'pdf-poster') . '</a></div>'
            );
        }

        /**
         * The small lock used on every gated row, inline so it needs no asset and
         * inherits the row colour. Shared with PDFP_SidebarCards so the metabox card
         * and the side-column card mark locked settings the same way.
         */
        public static function lock_icon() {
            return '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true" focusable="false"><rect x="4" y="11" width="16" height="10" rx="1.5"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
        }

        /**
         * The card that lists the settings a section keeps shut on the free build.
         *
         * Same ledger surface as the cards in the side column (PDFP_SidebarCards):
         * ink border, a ruled header strip naming what it reports, hairline-ruled
         * feature cells and a single blue CTA. Styles live in src/admin.scss under
         * .pdfp-ledger--wide -- build/admin.css is enqueued on every admin screen, so
         * the metabox and the settings pages both pick them up.
         *
         * @param array $features Labels of the gated settings, in the order shown.
         * @return array CSF 'content' field.
         */
        public static function pro_feature_list($features) {
            $features = array_filter((array) $features);
            $total = count($features);

            if (!$total) {
                return array('type' => 'content', 'content' => '');
            }

            $html = '<div class="pdfp-ledger pdfp-ledger--wide">
                <div class="pdfp-ledger__rule">
                    <span>' . esc_html__('Pro version', 'pdf-poster') . '</span>
                    <span>' . esc_html__('Locked', 'pdf-poster') . '</span>
                </div>

                <div class="pdfp-ledger__pad">
                    <h4 class="pdfp-ledger__title">' . sprintf(
                        /* translators: %d: number of settings in this section available only in the Pro version. */
                        esc_html(_n('%d setting the free build keeps shut.', '%d settings the free build keeps shut.', $total, 'pdf-poster')),
                        absint($total)
                    ) . '</h4>

                    <ul class="pdfp-ledger__rows">';

            foreach ($features as $feature) {
                $html .= '<li>' . self::lock_icon() . esc_html($feature) . '</li>';
            }

            $html .= '</ul>

                    <div class="pdfp-ledger__actions">
                        <a class="pdfp-ledger__cta" href="' . esc_url(self::pricing_url()) . '">'
                            . esc_html__('See Pro pricing', 'pdf-poster') .
                        '</a>
                        <p class="pdfp-ledger__foot">' . esc_html__('14-day refund policy', 'pdf-poster') . '</p>
                    </div>
                </div>
            </div>';

            return array(
                'type' => 'content',
                'content' => $html
            );
        }

        public static function quick_embed_shortcode() {
            return [
                'type' => 'content',
                'content' => '
                <div class="pdfp-quick-embed-shortcode-wrapper">
                    <div class="shortcode-container">
                        <code id="pdfp-shortcode-text">[pdf_embed url="your_file_url"]</code>
                        <button type="button" class="pdfp-copy-shortcode" data-shortcode=\'[pdf_embed url="your_file_url"]\'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span class="copy-text">' . __('Copy', 'pdf-poster') . '</span>
                        </button>
                    </div>
                    <p class="description">' . __('Copy and paste this shortcode into any page or post. Replace <code>your_file_url</code> with your actual PDF link.', 'pdf-poster') . '</p>
                </div>
            '
            ];
        }

        public static function upcoming_section() {
            return array(
                'type' => 'content',
                'content' => '<div class="pdfp-metabox-upcoming-section">' . esc_html__('This feature is coming soon. Stay tuned for updates!', 'pdf-poster') . '</div>'
            );
        }

        public static function pdfp_preset($key, $default = false) {
            $settings = get_option('fpdf_option');
            return $settings[$key] ?? $default;
        }


        /**
         * ------------------------------------------------------------------
         * Document Insights  (view / download counting)
         * ------------------------------------------------------------------
         * Everything here is shared between the render path (which only STAMPS a
         * document key into the markup) and the track endpoint (which counts). No
         * counting ever happens during render: render.php runs on a cache miss, so a
         * counter living there records one view per cache generation instead of one
         * per visitor.
         */

        /**
         * All-time totals for one document, straight from the rollup table.
         *
         * @param string $doc_key A key from pdfp_doc_key().
         * @return array{views:int,downloads:int,prints:int,last_day:?string}
         */
        public static function pdfp_doc_totals($doc_key)
        {
            global $wpdb;

            $empty = array('views' => 0, 'downloads' => 0, 'prints' => 0, 'last_day' => null);

            if (!self::pdfp_is_doc_key($doc_key)) {
                return $empty;
            }

            $table = self::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT SUM(views) AS views, SUM(downloads) AS downloads, SUM(prints) AS prints, MAX(day) AS last_day, MAX(last_seen) AS last_seen FROM {$table} WHERE doc_id = %s",
                    $doc_key
                ),
                ARRAY_A
            );

            if (!$row) {
                return $empty;
            }

            return array(
                'views' => (int) $row['views'],
                'downloads' => (int) $row['downloads'],
                'prints' => (int) $row['prints'],
                'last_day' => $row['last_day'] ?: null,
                'last_seen' => $row['last_seen'] ?: null,
            );
        }

        /**
         * TODAY's counters for one document. The free tier's entire readout.
         *
         * One row on the (doc_id, day) unique key -- the cheapest read in the feature,
         * which is why this is the slice that can be given away.
         *
         * `day` is written by PDFP_Track::record() with current_time(), so it is read
         * back with current_time() too. Using gmdate() here would silently disagree with
         * the counter by the site's UTC offset, and the number would appear to reset at
         * the wrong hour.
         *
         * @param string $doc_key A key from pdfp_doc_key().
         * @return array{views:int,downloads:int}
         */
        public static function pdfp_doc_today($doc_key)
        {
            global $wpdb;

            $empty = array('views' => 0, 'downloads' => 0);

            if (!self::pdfp_is_doc_key($doc_key)) {
                return $empty;
            }

            $table = self::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT views, downloads FROM {$table} WHERE doc_id = %s AND day = %s",
                    $doc_key,
                    current_time('Y-m-d')
                ),
                ARRAY_A
            );

            if (!$row) {
                return $empty;
            }

            return array(
                'views' => (int) $row['views'],
                'downloads' => (int) $row['downloads'],
            );
        }

        /**
         * The first day anything was ever counted, site-wide or for one document.
         *
         * Serves both tiers from one query. Free uses it for the "Counting since" line
         * that gives today's number a provenance; Pro uses it to clip the chart, because
         * a range that starts before this date is not "nobody read anything" -- it is
         * "not measured yet", and zero-filling it makes a good first week look like a
         * failure.
         *
         * @param string $doc_key Optional. Narrow to one document.
         * @return string|null Y-m-d, or null if nothing has ever been counted.
         */
        public static function pdfp_first_day($doc_key = '')
        {
            global $wpdb;

            $table = self::pdfp_stats_table();
            $doc = self::pdfp_is_doc_key($doc_key) ? $doc_key : '';

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $day = $doc
                ? $wpdb->get_var(
                    $wpdb->prepare(
                        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                        "SELECT MIN(day) FROM {$table} WHERE doc_id = %s",
                        $doc
                    )
                )
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
                : $wpdb->get_var("SELECT MIN(day) FROM {$table}");

            return $day ? $day : null;
        }

        /**
         * Today's counters for every SAVED poster, keyed by post id.
         *
         * For the list table, which draws two cells per row over twenty rows. Reading each
         * one on its own would be forty queries; today's rows are at most one per document
         * that has actually been opened today, so fetching the lot once is both cheaper and
         * simpler. Held in a static for the rest of the request.
         *
         * Only `p:` rows are returned -- url-keyed embeds have no row on this screen.
         *
         * @return array<int, array{views:int,downloads:int}>
         */
        public static function pdfp_today_rows_by_post()
        {
            static $rows = null;

            if ($rows !== null) {
                return $rows;
            }

            global $wpdb;

            $rows = array();
            $table = self::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $found = $wpdb->get_results(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT post_id, views, downloads FROM {$table} WHERE day = %s AND post_id > 0",
                    current_time('Y-m-d')
                ),
                ARRAY_A
            );

            foreach ((array) $found as $row) {
                $rows[(int) $row['post_id']] = array(
                    'views' => (int) $row['views'],
                    'downloads' => (int) $row['downloads'],
                );
            }

            return $rows;
        }

        /**
         * One line of provenance to sit under a "today" number.
         *
         * A bare 0 reads as a broken feature. It has three quite different causes -- the
         * owner switched counting off, counting is on but this document has never been
         * opened, or it has been read before but not yet today -- and each deserves its
         * own sentence. This is the only place that decides which.
         *
         * @param string $doc_key
         * @return string Plain text, ready to escape.
         */
        public static function pdfp_counting_since_text($doc_key)
        {
            if (!self::pdfp_tracking_enabled()) {
                return __('Counting is switched off in Settings > Analytics.', 'pdf-poster');
            }

            $first = self::pdfp_first_day($doc_key);

            if (!$first) {
                return __('Counting is on. Nothing recorded for this document yet.', 'pdf-poster');
            }

            return sprintf(
                /* translators: %s: the date counting began, e.g. "12 September 2026" */
                __('Counting since %s. Resets at midnight, site time.', 'pdf-poster'),
                date_i18n(get_option('date_format'), strtotime($first))
            );
        }

        /**
         * How much history is already recorded, and therefore how much a licence reads back.
         *
         * The free Analytics screen's whole pitch rests on this being the site's OWN
         * number rather than a feature list, so it is counted, not estimated:
         * COUNT(DISTINCT day) is literally "days recorded", where the calendar span
         * between the first row and today would also count weeks a site sat idle and
         * overstate the offer.
         *
         * Both figures EXCLUDE today, because today is already readable on every tier --
         * what a licence unlocks is everything before midnight. A site counting for the
         * first time today therefore reports zero days, which is the truth and is the
         * case the card has separate copy for.
         *
         * Free-build only by call site: nothing Pro draws needs it, and it is two
         * aggregates over the whole table.
         *
         * @param string $doc_key Optional single document.
         * @return array{days:int,rows:int,firstDay:string|null}
         */
        public static function pdfp_recorded_history($doc_key = '')
        {
            global $wpdb;

            static $cache = array();

            $table = self::pdfp_stats_table();
            $doc = self::pdfp_is_doc_key($doc_key) ? $doc_key : '';
            $today = current_time('Y-m-d');

            // The classic editor's side box asks twice -- once for the panel, once to
            // label its button -- and they must not disagree either.
            if (isset($cache[$doc])) {
                return $cache[$doc];
            }

            // `rows` is reserved in MySQL 8, hence the alias.
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT COUNT(DISTINCT day) AS days, COUNT(*) AS rows_count
                     FROM {$table} WHERE day < %s" . ($doc ? " AND doc_id = %s" : ""),
                    $doc ? array($today, $doc) : array($today)
                ),
                ARRAY_A
            );

            $cache[$doc] = array(
                'days' => isset($row['days']) ? (int) $row['days'] : 0,
                'rows' => isset($row['rows_count']) ? (int) $row['rows_count'] : 0,
                'firstDay' => self::pdfp_first_day($doc),
            );

            return $cache[$doc];
        }

        /**
         * The locked-history block for the classic editor's side box.
         *
         * The same three moves as the Analytics screen and the block sidebar, at side-box
         * width: the real figures stay sharp above this, the withholding is COUNTED, and
         * the shape is an example -- frosted and labelled, because no daily figure for a
         * past day is read on a free build, so there is no numeral here for the blur to
         * be hiding.
         *
         * .pdfp-lock-field on the wrapper is what the existing PDFP_ProModal click
         * handler listens for, so the whole block stays the way into the upgrade modal.
         *
         * @param string $doc_key
         * @return string Built and escaped, ready to echo.
         */
        public static function pdfp_locked_history_html($doc_key) {
            $days = (int) self::pdfp_recorded_history($doc_key)['days'];

            $lock = '<svg class="pdfp-insights-lockglyph" viewBox="0 0 9 11" aria-hidden="true" focusable="false">'
                . '<path d="M2 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3" fill="none" stroke="currentColor" stroke-width="1.2" />'
                . '<rect x="1" y="4.5" width="7" height="5.5" fill="currentColor" />'
                . '</svg>';

            $html = '<a class="pdfp-insights-locked-history" href="' . esc_url(self::pricing_url()) . '">';

            $html .= '<span class="pdfp-insights-lockline">' . $lock . esc_html(
                $days > 0
                    ? sprintf(
                        /* translators: %s: number of days of history already recorded */
                        _n('%s day recorded', '%s days recorded', $days, 'pdf-poster'),
                        number_format_i18n($days)
                    )
                    : __('Recording now', 'pdf-poster')
            ) . '<em>' . esc_html__('example', 'pdf-poster') . '</em></span>';

            // An example shape, not a measurement: fixed points, blurred in CSS, and
            // marked presentational so it is never announced as data.
            $html .= '<svg class="pdfp-insights-veil" viewBox="0 0 260 44" role="presentation">'
                . '<polyline fill="none" stroke="#146ef5" stroke-width="2" stroke-linejoin="round"'
                . ' stroke-linecap="round" points="4,33 25,26 46,30 67,19 88,24 109,13 130,21 151,11'
                . ' 172,17 193,9 214,15 235,7 256,13" />'
                . '</svg>';

            $html .= '<p class="pdfp-insights-note">' . esc_html(
                $days > 0
                    ? sprintf(
                        /* translators: %s: number of days of history already recorded */
                        _n(
                            'Your last %s day is recorded in your own database. Pro reads it back as totals, a 14-day trend, your best-performing documents and a report you can export.',
                            'Your last %s days are recorded in your own database. Pro reads them back as totals, a 14-day trend, your best-performing documents and a report you can export.',
                            $days,
                            'pdf-poster'
                        ),
                        number_format_i18n($days)
                    )
                    : __('Yesterday and earlier are being recorded in your own database. Pro reads them back as totals, trends and a report.', 'pdf-poster')
            ) . '</p>';

            return $html . '</a>';
        }

        /**
         * Daily view counts for one document, most recent last, zero-filled.
         *
         * Zero-filling matters for a sparkline: a gap that is simply skipped draws a
         * straight line across days nobody read anything, which is a different shape from
         * the truth.
         *
         * @param string $doc_key
         * @param int    $days
         * @return int[]
         */
        public static function pdfp_doc_series($doc_key, $days = 14) {
            global $wpdb;

            $days = max(1, min(90, (int) $days));

            if (!self::pdfp_is_doc_key($doc_key)) {
                return array_fill(0, $days, 0);
            }

            $table = self::pdfp_stats_table();
            $to = current_time('Y-m-d');
            $from = gmdate('Y-m-d', strtotime($to . ' -' . ($days - 1) . ' day'));

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT day, SUM(views) AS views FROM {$table}
                     WHERE doc_id = %s AND day BETWEEN %s AND %s GROUP BY day",
                    $doc_key,
                    $from,
                    $to
                ),
                ARRAY_A
            );

            $by_day = array();
            foreach ((array) $rows as $row) {
                $by_day[$row['day']] = (int) $row['views'];
            }

            $out = array();
            for ($i = 0; $i < $days; $i++) {
                $day = gmdate('Y-m-d', strtotime($from . ' +' . $i . ' day'));
                $out[] = isset($by_day[$day]) ? $by_day[$day] : 0;
            }

            return $out;
        }

        /**
         * The 14-day trend graphic: sparkline plus its percentage change.
         *
         * Hand-authored SVG, mirroring the <Spark> component in the block sidebar so both
         * editors show the same shape from the same numbers.
         *
         * Drawn even when the window is empty. Returning '' there made the licensed side
         * box SHORTER than the free one, which shows an example shape in the same place,
         * and a chart that vanishes when a number reaches zero reads as broken rather
         * than as empty. The old worry -- a flat blue line looking like steady traffic --
         * is answered by the finish instead: the empty line drops to the slate the rest
         * of the admin uses for absent values, loses its endpoint dot, and is labelled
         * "no views yet" in words beside it.
         *
         * @param string $doc_key
         * @param int    $days
         * @return string HTML
         */
        public static function pdfp_insights_trend_html($doc_key, $days = 14)
        {
            $series = self::pdfp_doc_series($doc_key, $days);
            $count = count($series);

            // Two points minimum: one day cannot draw a line. The values are not
            // tested -- an empty window is a state to render, not a reason to hide.
            if ($count < 2) {
                return '';
            }

            $empty = array_sum($series) <= 0;
            $stroke = $empty ? '#cbd5e1' : '#146ef5';

            $width = 260;
            $height = 44;
            $pad = 4;
            $peak = max($series);
            $peak = $peak > 0 ? $peak : 1;
            $step = ($width - $pad * 2) / ($count - 1);
            $plot = $height - $pad * 3;

            $points = array();
            $last_x = $pad;
            $last_y = $pad;

            foreach ($series as $i => $value) {
                $x = $pad + ($i * $step);
                $y = $pad + ($plot * (1 - ($value / $peak)));
                $points[] = round($x, 1) . ',' . round($y, 1);
                $last_x = $x;
                $last_y = $y;
            }

            // Split the window in half and compare, the same arithmetic the read model
            // uses for the block sidebar, so the two never disagree.
            $half = (int) floor($count / 2);
            $recent = array_sum(array_slice($series, $half));
            $earlier = array_sum(array_slice($series, 0, $half));
            $trend = $earlier > 0 ? (int) round((($recent - $earlier) / $earlier) * 100) : null;

            $html = '<svg class="pdfp-insights-spark" viewBox="0 0 ' . $width . ' ' . $height . '"'
                . ' role="img" aria-label="' . esc_attr(sprintf(
                    $empty
                        /* translators: %d: number of days */
                        ? __('No views in the last %d days', 'pdf-poster')
                        /* translators: %d: number of days */
                        : __('View trend over the last %d days', 'pdf-poster'),
                    $days
                )) . '">'
                . '<polyline fill="none" stroke="' . esc_attr($stroke) . '" stroke-width="2" stroke-linejoin="round"'
                . ' stroke-linecap="round" points="' . esc_attr(implode(' ', $points)) . '" />';

            // No endpoint dot on an empty window: a marked "latest value" implies there
            // is a value to mark.
            if (!$empty) {
                $html .= '<circle cx="' . esc_attr(round($last_x, 1)) . '" cy="' . esc_attr(round($last_y, 1)) . '"'
                    . ' r="3.2" fill="' . esc_attr($stroke) . '" stroke="#fff" stroke-width="2" />';
            }

            $html .= '</svg>';

            $html .= '<div class="pdfp-insights-trend">'
                . '<span>' . esc_html(sprintf(
                    /* translators: %d: number of days */
                    __('Last %d days', 'pdf-poster'),
                    $days
                )) . '</span>';

            if ($empty) {
                $html .= '<span class="pdfp-insights-flat">' . esc_html__('no views yet', 'pdf-poster') . '</span>';
            } elseif ($trend === null) {
                $html .= '<span class="pdfp-insights-flat">' . esc_html__('no baseline', 'pdf-poster') . '</span>';
            } else {
                $class = $trend >= 0 ? 'pdfp-insights-up' : 'pdfp-insights-down';
                $html .= '<span class="' . esc_attr($class) . '">'
                    . esc_html(($trend > 0 ? '+' : '') . $trend . '%') . '</span>';
            }

            return $html . '</div>';
        }

        /**
         * Views and Downloads as two tiles, plus the trend graphic underneath.
         *
         * The shape the block sidebar uses, so the classic editor's side box is the same
         * panel rather than a second design of the same information.
         *
         * @param int $post_id
         * @return void
         */
        public static function pdfp_render_insights_panel($post_id)
        {
            $post_id = (int) $post_id;

            if (!$post_id || !current_user_can('edit_post', $post_id)) {
                return;
            }

            $doc = 'p:' . $post_id;

            // Free build: real numbers, for today. The box keeps its place and its shape;
            // what is withheld is every reading of the past, and the note that says so is
            // a link to the pricing screen.
            if (!self::pdfp_analytics_available()) {
                $counting = self::pdfp_tracking_enabled();
                // Only queried when there is a figure to show: with counting off the
                // tiles render an em dash, so the row lookup would be thrown away.
                $today = $counting ? self::pdfp_doc_today($doc) : array('views' => 0, 'downloads' => 0);

                echo '<div class="pdfp-insights pdfp-insights-compact">';
                echo '<div class="pdfp-insights-grid">';

                $tiles = array(
                    __('Views today', 'pdf-poster') => $today['views'],
                    __('Downloads today', 'pdf-poster') => $today['downloads'],
                );

                foreach ($tiles as $label => $value) {
                    // With counting switched off there is no figure, and a hard 0 would
                    // claim the document was measured and nobody looked -- a different
                    // (and untrue) fact. Same em dash the PDF Posters columns use, with
                    // the reason in a screen-reader label; the note below says it in
                    // words for everyone else.
                    $figure = $counting
                        ? '<span class="pdfp-insight-value">'
                            . esc_html(number_format_i18n((int) $value)) . '</span>'
                        : '<span class="pdfp-insight-value pdfp-insight-locked" aria-hidden="true">&mdash;</span>'
                            . '<span class="screen-reader-text">'
                            . esc_html__('Counting is switched off', 'pdf-poster') . '</span>';

                    printf(
                        '<div class="pdfp-insight"><span class="pdfp-insight-label">%s</span>%s</div>',
                        esc_html($label),
                        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built and escaped just above.
                        $figure
                    );
                }

                echo '</div>';

                printf(
                    '<p class="pdfp-insights-note">%s</p>',
                    esc_html(self::pdfp_counting_since_text($doc))
                );

                // A PRO chip beside a sentence names the price list. The block below
                // names the site's own past instead, which is the thing a licence
                // actually reads back.
                // phpcs:ignore WordPress.Security.EscapingOutput.OutputNotEscaped -- built and escaped in pdfp_locked_history_html()
                echo self::pdfp_locked_history_html($doc);

                echo '</div>';
                return;
            }

            $totals = self::pdfp_doc_totals($doc);

            echo '<div class="pdfp-insights pdfp-insights-compact">';

            echo '<div class="pdfp-insights-grid">';
            printf(
                '<div class="pdfp-insight"><span class="pdfp-insight-label">%s</span><span class="pdfp-insight-value">%s</span></div>',
                esc_html__('Views', 'pdf-poster'),
                esc_html(number_format_i18n($totals['views']))
            );
            printf(
                '<div class="pdfp-insight"><span class="pdfp-insight-label">%s</span><span class="pdfp-insight-value">%s</span></div>',
                esc_html__('Downloads', 'pdf-poster'),
                esc_html(number_format_i18n($totals['downloads']))
            );
            echo '</div>';

            // phpcs:ignore WordPress.Security.EscapingOutput.OutputNotEscaped -- built and escaped in pdfp_insights_trend_html()
            echo self::pdfp_insights_trend_html($doc);

            echo '</div>';
        }

        /**
         * Every PDF URL embedded in a post's content, block or shortcode.
         *
         * @param string $content
         * @return string[]
         */
        public static function pdfp_extract_embed_files($content)
        {
            $files = array();

            if (strpos($content, 'pdfp/pdfposter') !== false) {
                foreach (parse_blocks($content) as $block) {
                    $stack = array($block);

                    // Blocks nest -- an embed inside a column inside a group is normal --
                    // so walk the tree rather than only its top level.
                    while ($stack) {
                        $current = array_pop($stack);

                        if (($current['blockName'] ?? '') === 'pdfp/pdfposter' && !empty($current['attrs']['file'])) {
                            $files[] = $current['attrs']['file'];
                        }

                        foreach (($current['innerBlocks'] ?? array()) as $inner) {
                            $stack[] = $inner;
                        }
                    }
                }
            }

            if (strpos($content, '[pdf_embed') !== false
                && preg_match_all('/\[pdf_embed[^\]]*\burl=[\"\']([^\"\']+)[\"\']/i', $content, $m)) {
                foreach ($m[1] as $url) {
                    $files[] = $url;
                }
            }

            return array_unique($files);
        }

        /**
         * Which page each url-keyed embed currently lives on.
         *
         * Built by reading post content, not from tracking data. `origin_post_id` on the
         * stats row only gets filled the next time someone views a document, so it is
         * blank for everything recorded before that column existed -- and it goes stale
         * if an embed is moved to another page. Scanning content answers "where is this
         * embedded *now*", which is the question the report is really asking.
         *
         * Cached for five minutes: it is one indexed-ish query plus a parse, and the
         * report asks for up to twenty rows at once.
         *
         * @return array<string,int> doc key => post id
         */
        public static function pdfp_embed_origin_map()
        {
            $cached = get_transient('pdfp_embed_origins');
            if (is_array($cached)) {
                return $cached;
            }

            global $wpdb;

            // pdfposter is excluded on purpose: a block inside a saved poster resolves to
            // a `p:<id>` key, never a `u:` one, so it would only ever add wrong entries.
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $rows = $wpdb->get_results(
                "SELECT ID, post_content FROM {$wpdb->posts}
                 WHERE post_status IN ('publish', 'private', 'draft', 'pending', 'future')
                   AND post_type NOT IN ('revision', 'attachment', 'pdfposter')
                   AND (post_content LIKE '%pdfp/pdfposter%' OR post_content LIKE '%[pdf_embed%')
                 ORDER BY post_modified DESC
                 LIMIT 500",
                ARRAY_A
            );

            $map = array();

            foreach ((array) $rows as $row) {
                foreach (self::pdfp_extract_embed_files($row['post_content']) as $file) {
                    $key = self::pdfp_doc_key($file, 0);

                    // First match wins, and rows arrive newest-modified first, so the most
                    // recently edited page is the one a reader is sent to.
                    if ($key !== '' && !isset($map[$key])) {
                        $map[$key] = (int) $row['ID'];
                    }
                }
            }

            set_transient('pdfp_embed_origins', $map, 5 * MINUTE_IN_SECONDS);

            return $map;
        }

        /** Fully-qualified name of the daily rollup table. */
        public static function pdfp_stats_table()
        {
            global $wpdb;
            return $wpdb->prefix . 'pdfposter_stats';
        }

        /**
         * Strip a file URL down to the part that identifies the document.
         *
         * Scheme, query and fragment all vary for the same file (http vs https, a
         * cache-buster, a Drive `usp=` tail) and would otherwise split one document
         * into several. Host is lower-cased; the path is kept as-is because it is
         * case-sensitive on most servers.
         */
        public static function pdfp_normalize_url($url)
        {
            $url = trim((string) $url);
            if ($url === '') {
                return '';
            }

            $parts = wp_parse_url($url);
            if (empty($parts)) {
                return $url;
            }

            $host = isset($parts['host']) ? strtolower($parts['host']) : '';
            $path = isset($parts['path']) ? $parts['path'] : '';

            return $host . rtrim($path, '/');
        }

        /**
         * The identity a document is counted under.
         *
         * A saved PDF Poster gets `p:<post id>`, so its counts can be read back with a
         * plain meta lookup and shown on the post list. Anything embedded ad hoc --
         * `[pdf_embed url="..."]`, a block dropped straight on a page, a remote CDN file
         * -- gets `u:<sha1 of the normalised url>`. That second case is exactly what the
         * market leader cannot count, because it keys on Media Library attachments.
         */
        public static function pdfp_doc_key($file, $poster_id = 0)
        {
            $poster_id = (int) $poster_id;
            if ($poster_id > 0) {
                return 'p:' . $poster_id;
            }

            $normalized = self::pdfp_normalize_url($file);
            if ($normalized === '') {
                return '';
            }

            return 'u:' . sha1($normalized);
        }

        /** Does this string look like a key we issued? Used to reject junk payloads. */
        public static function pdfp_is_doc_key($key)
        {
            return (bool) preg_match('/^(p:[1-9][0-9]{0,18}|u:[0-9a-f]{40})$/', (string) $key);
        }

        /** Post id carried by a `p:` key, or 0 for a url-keyed document. */
        public static function pdfp_doc_post_id($key)
        {
            if (strpos((string) $key, 'p:') === 0) {
                return (int) substr($key, 2);
            }
            return 0;
        }

        /**
         * Can this build read the HISTORY back?
         *
         * The tier line, and the only place it lives. Every build counts (see
         * pdfp_should_count()); every build shows TODAY (see pdfp_doc_today()). What a
         * licence unlocks is every reading of the past: all-time totals, ranges, the
         * chart, the previous-period delta, the sparkline and trend, the busiest day, the
         * ranking and the CSV.
         *
         * Because it is checked at read time and never written into a row, entitlement can
         * change in either direction for free -- upgrading reveals the history a free site
         * already accumulated, and a lapsed licence simply re-locks it without deleting
         * anything.
         *
         * Kept separate from pdfp_tracking_enabled(), which is the site owner's switch.
         * The two answer different questions and the UI needs to tell them apart: "not in
         * your plan" and "you turned it off" call for different words and different
         * controls.
         */
        public static function pdfp_analytics_available()
        {
            return false;
        }

        /**
         * Are the site's own editors kept out of the numbers?
         *
         * A setting, not a fact -- so any UI that tells the reader "your own visits are
         * not counted" has to ask first. Reads the same preset pdfp_should_count()
         * enforces, so the promise and the behaviour cannot drift apart.
         */
        public static function pdfp_excluding_editors()
        {
            return self::pdfp_preset('pdfp_tracking_exclude_editors', '1') === '1';
        }

        /** Is counting switched on for this site at all? Default on. */
        public static function pdfp_tracking_enabled()
        {
            $settings = get_option('fpdf_option');
            if (!is_array($settings) || !array_key_exists('pdfp_tracking_enable', $settings)) {
                return true;
            }
            return (string) $settings['pdfp_tracking_enable'] === '1';
        }

        /**
         * Should this particular request be counted?
         *
         * Called by the endpoint, not by render, so it can see the real visitor rather
         * than whoever happened to warm the cache.
         */
        public static function pdfp_should_count()
        {
            // Deliberately NOT gated on entitlement. Every build counts; what a licence
            // buys is the right to read the history back (see pdfp_analytics_available(),
            // which guards the readers instead).
            //
            // Writing unconditionally is what makes upgrading instant: the rows a free
            // site accumulated are ordinary rows, so the moment a licence activates the
            // range readers simply stop refusing and the chart is already full. Stamping
            // entitlement into the data would turn every purchase, lapse and renewal into
            // a migration.
            if (!self::pdfp_tracking_enabled()) {
                return false;
            }

            // Staff previewing their own site are not an audience. Default on.
            $exclude_editors = self::pdfp_preset('pdfp_tracking_exclude_editors', '1') === '1';
            if ($exclude_editors && is_user_logged_in() && current_user_can('edit_posts')) {
                return false;
            }

            if (self::pdfp_preset('pdfp_tracking_respect_dnt', '0') === '1') {
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                $dnt = isset($_SERVER['HTTP_DNT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_DNT'])) : '';
                if ($dnt === '1') {
                    return false;
                }
            }

            if (self::pdfp_is_bot()) {
                return false;
            }

            return true;
        }

        /**
         * Crude but effective bot check.
         *
         * The real defence is architectural: counting happens from a JS beacon, and the
         * crawlers that matter fetch HTML and stop. This only catches the headless
         * minority that does execute scripts.
         */
        public static function pdfp_is_bot()
        {
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $ua = isset($_SERVER['HTTP_USER_AGENT']) ? strtolower(sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']))) : '';
            if ($ua === '') {
                return true;
            }

            $needles = array(
                'bot', 'crawl', 'spider', 'slurp', 'headless', 'phantomjs', 'puppeteer',
                'playwright', 'lighthouse', 'pingdom', 'gtmetrix', 'monitoring', 'preview',
                'facebookexternalhit', 'wordpress/', 'curl/', 'wget/', 'python-requests',
            );

            foreach ($needles as $needle) {
                if (strpos($ua, $needle) !== false) {
                    return true;
                }
            }

            return false;
        }

        /**
         * A per-visitor identifier that cannot be turned back into a person.
         *
         * sha1(daily salt + ip + user agent). The salt is regenerated every day and the
         * previous one is thrown away, so today's hashes cannot be matched against
         * yesterday's and no raw IP is ever written anywhere. Used only as a transient
         * key for de-duplication -- in v2.6.0 it is never stored in a table.
         */
        public static function pdfp_visitor_hash()
        {
            $day = gmdate('Y-m-d');
            $salt = get_option('pdfp_track_salt');
            $salt_day = get_option('pdfp_track_salt_day');

            if (!$salt || $salt_day !== $day) {
                $salt = wp_generate_password(32, false, false);
                update_option('pdfp_track_salt', $salt, false);
                update_option('pdfp_track_salt_day', $day, false);
            }

            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $ua = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';

            return sha1($salt . '|' . $ip . '|' . $ua);
        }


        /**
         * Watermark themes the free build may render.
         *
         * The three TEXT themes. The logo themes need the image mark, and Custom is the
         * escape hatch that unlocks every THEME_OWNED row -- both stay Pro.
         */
        public static function pdfp_watermark_free_themes()
        {
            return apply_filters('pdfp_watermark_free_themes', array('confidential', 'draft', 'wash'));
        }

        /**
         * ------------------------------------------------------------------
         * Watermark & Branding
         * ------------------------------------------------------------------
         * The panel stores TOKENS ('subtle', 'dense', 'diagonal'), never numbers.
         * This table is the single place tokens become values, so improving a
         * recipe in a later release improves every document already using it.
         * Kept deliberately in step with the JS copy in
         * src/blocks/pdf-poster/components/Common/watermarkSVG.js -- if you edit
         * one, edit the other.
         */
        public static function pdfp_watermark_themes()
        {
            $themes = array(
                'confidential' => array(
                    'label' => __('Confidential', 'pdf-poster'),
                    'types' => array('text'),
                    'markType' => 'text',  'coverage' => 'normal', 'angle' => 'diagonal',
                    'strength' => 'subtle', 'size' => 'medium', 'color' => '#808080',
                    'weight' => 700, 'tracking' => 2, 'upper' => true, 'position' => 'center',
                ),
                'draft' => array(
                    'label' => __('Draft Stamp', 'pdf-poster'),
                    'types' => array('text'),
                    'markType' => 'text',  'coverage' => 'off', 'angle' => 'diagonal',
                    'strength' => 'strong', 'size' => 'large', 'color' => '#AF4A3D',
                    'weight' => 700, 'tracking' => 3, 'upper' => true, 'position' => 'center',
                    'outline' => true,
                ),
                'wash' => array(
                    'label' => __('Sample Wash', 'pdf-poster'),
                    'types' => array('text'),
                    'markType' => 'text',  'coverage' => 'dense', 'angle' => 'diagonal',
                    'strength' => 'faint', 'size' => 'small', 'color' => '#808080',
                    'weight' => 700, 'tracking' => 1, 'upper' => true, 'position' => 'center',
                ),
                'brand-corner' => array(
                    'label' => __('Brand Corner', 'pdf-poster'),
                    'types' => array('image'),
                    'markType' => 'image', 'coverage' => 'off', 'angle' => 'flat',
                    'strength' => 'solid', 'size' => 'small', 'imageStyle' => 'original',
                    'position' => 'bottom right',
                ),
                'logo-wash' => array(
                    'label' => __('Logo Wash', 'pdf-poster'),
                    'types' => array('image'),
                    'markType' => 'image', 'coverage' => 'normal', 'angle' => 'diagonal',
                    'strength' => 'faint', 'size' => 'medium', 'imageStyle' => 'grayscale',
                    'position' => 'center',
                ),
                'logo-caption' => array(
                    'label' => __('Logo + Caption', 'pdf-poster'),
                    'types' => array('both'),
                    'markType' => 'both',  'coverage' => 'off', 'angle' => 'diagonal',
                    'strength' => 'subtle', 'size' => 'large', 'imageStyle' => 'original',
                    'color' => '#808080', 'weight' => 600, 'tracking' => 2, 'upper' => true,
                    'position' => 'center',
                ),
                'custom' => array(
                    'label' => __('Custom', 'pdf-poster'),
                    'types' => array('text', 'image', 'both'),
                    'coverage' => 'normal', 'angle' => 'diagonal', 'strength' => 'subtle',
                    'size' => 'medium', 'color' => '#808080', 'imageStyle' => 'grayscale',
                    'weight' => 700, 'tracking' => 2, 'upper' => true, 'position' => 'center',
                ),
            );

            return apply_filters('pdfp_watermark_themes', $themes);
        }

        /**
         * A group headline for the Watermark section — "label, rule right".
         *
         * CSF renders `subheading` as a plain grey band that disappears between the
         * fields it separates. This gives each group a left-aligned label in the brand
         * blue with a hairline carrying on to the right edge, and a plain-language line
         * beneath saying what the group is for. It reads as a section break rather than
         * another setting, and adds almost no weight -- which matters because it repeats
         * four times down the panel.
         *
         * The rule is drawn with ::after on the title row rather than a knocked-out
         * background, so it works on any band colour.
         *
         * Styles live in src/admin.scss (.pdfp-wm-subhead); build/admin.css is enqueued
         * on post.php, post-new.php and every pdfposter screen.
         */
        public static function pdfp_watermark_subhead($title, $desc, $dependency = null)
        {
            $field = array(
                'type' => 'subheading',
                'content' =>
                    '<div class="pdfp-wm-subhead">'
                    . '<div class="pdfp-wm-subhead__rule">'
                    . '<span class="pdfp-wm-subhead__title">' . esc_html($title) . '</span>'
                    . '</div>'
                    . '<p class="pdfp-wm-subhead__desc">' . esc_html($desc) . '</p>'
                    . '</div>',
            );

            // CSF writes the dependency attributes on the field wrapper, before it
            // looks at the type, so a headline can hide with the rows it introduces --
            // no id needed. Without this a group whose every row is conditional leaves
            // its headline stranded over nothing.
            if ($dependency) {
                $field['dependency'] = $dependency;
            }

            return $field;
        }

        /**
         * The Watermark section's opening card, shown only while the feature is off.
         *
         * An author who opens the tab otherwise sees one toggle set to Off and no reason
         * to touch it. This deals the six shipped looks out like a hand of cards -- the
         * same SVGs the Theme row uses, so the pitch can never advertise something the
         * renderer does not produce -- and states the thing that makes the switch safe to
         * try: the mark is drawn over the document as it displays, the file is untouched.
         *
         * The deck spreads on hover, and the button flips the switcher (see src/admin.js).
         */
        public static function pdfp_watermark_intro($dependency = null)
        {
            $themes = array(
                'confidential'  => __('Confidential', 'pdf-poster'),
                'draft'         => __('Draft Stamp', 'pdf-poster'),
                'wash'          => __('Sample Wash', 'pdf-poster'),
                'brand-corner'  => __('Brand Corner', 'pdf-poster'),
                'logo-wash'     => __('Logo Wash', 'pdf-poster'),
                'logo-caption'  => __('Logo + Caption', 'pdf-poster'),
            );

            // The fan: rotation, horizontal offset and scale per card, dealt left to right.
            $fan = array(
                array(-16, -30, 0.90), array(-10, -18, 0.94), array(-4, -6, 0.97),
                array(3, 6, 1.00), array(9, 18, 0.97), array(15, 30, 0.94),
            );

            $cards = '';
            $i = 0;
            foreach ($themes as $key => $label) {
                list($rot, $dx, $scale) = $fan[$i];
                $cards .= '<img class="pdfp-wm-intro__card" alt="' . esc_attr($label) . '" title="' . esc_attr($label) . '"'
                    . ' src="' . esc_url(PDFPRO_PLUGIN_DIR . 'assets/admin/img/watermark/' . $key . '.svg') . '"'
                    . ' style="--r:' . $rot . 'deg;--x:' . $dx . 'px;--s:' . $scale . ';z-index:' . $i . '">';
                $i++;
            }

            $chips = array(
                __('Text, a logo, or both', 'pdf-poster'),
                __('Tiled or one corner mark', 'pdf-poster'),
                __('Pick the pages', 'pdf-poster'),
                __('Pick who sees it', 'pdf-poster'),
            );
            $chiphtml = '';
            foreach ($chips as $chip) {
                $chiphtml .= '<li>' . esc_html($chip) . '</li>';
            }

            // Free and Pro both get the button: the Enable switch is free, and the free
            // build has three text themes to land on once it is flipped.
            $go = '<button type="button" class="button button-primary pdfp-wm-intro__go" data-pdfp-enable="watermark_enable">'
                . esc_html__('Turn on watermarking', 'pdf-poster') . ' <span aria-hidden="true">&rarr;</span>'
                . '</button>';

            $content =
                '<div class="pdfp-wm-intro">'
                . '<div class="pdfp-wm-intro__fan">' . $cards . '</div>'
                . '<div class="pdfp-wm-intro__say">'
                . '<p class="pdfp-wm-intro__count"><b>' . esc_html(count($themes)) . '</b> '
                . esc_html__('looks, ready to go', 'pdf-poster') . '</p>'
                . '<h4>' . esc_html__('Stamp every page — the file is never touched.', 'pdf-poster') . '</h4>'
                . '<p class="pdfp-wm-intro__sub">'
                . esc_html__('The mark is drawn over the document as it is displayed, so the PDF on your server stays exactly as you uploaded it. Pick one of these and you are done, or take the Custom theme and set the colour, angle, size and tiling yourself.', 'pdf-poster')
                . '</p>'
                . '<ul class="pdfp-wm-intro__chips">' . $chiphtml . '</ul>'
                . $go
                . '</div>'
                . '</div>';

            $field = array(
                'type' => 'subheading',
                'class' => 'pdfp-wm-intro-row',
                'content' => $content,
            );

            if ($dependency) {
                $field['dependency'] = $dependency;
            }

            return $field;
        }

        /**
         * image_select options for the Theme row. CSF runs esc_url() over these,
         * which strips data: URIs -- hence real files rather than inline SVG.
         *
         * Filtered to what this build may draw, rather than offering all seven and
         * hiding the rest in JavaScript: pdfp_watermark_resolve() would refuse to render
         * a locked theme anyway, so a picker that offers one is wrong with scripts off
         * as well as on. The metabox section names the Pro themes in its ledger instead.
         */
        public static function pdfp_watermark_thumbs()
        {
            $base = PDFPRO_PLUGIN_DIR . 'assets/admin/img/watermark/';
            $free = self::pdfp_watermark_free_themes();
            $out = array();

            foreach (array_keys(self::pdfp_watermark_themes()) as $key) {
                if (!in_array($key, $free, true)) {
                    continue;
                }
                $out[$key] = $base . $key . '.svg';
            }

            return $out;
        }

        /**
         * Tokens that can be resolved server-side without leaking one visitor's
         * data into another visitor's cached page.
         */
        public static function pdfp_watermark_static_tokens($post_id)
        {
            $tokens = array(
                '{site_name}'  => get_bloginfo('name'),
                '{post_title}' => get_the_title($post_id),
                '{file_name}'  => '',
                '{date}'       => date_i18n(get_option('date_format')),
                '{year}'       => date_i18n('Y'),
            );

            return apply_filters('pdfp_watermark_placeholders', $tokens, $post_id);
        }

        /**
         * Any token whose value belongs to the *visitor* rather than the document.
         * These are never resolved here -- see the note on $config['dynamic'].
         */
        public static function pdfp_watermark_dynamic_tokens()
        {
            return array('{user_name}', '{user_email}', '{user_ip}', '{page}', '{pages}');
        }

        /**
         * Should this visitor see a mark at all?
         */
        public static function pdfp_watermark_audience_allows($audience)
        {
            $logged_in = is_user_logged_in();

            if ('guests' === $audience) {
                return !$logged_in;
            }

            if ('except-admin' === $audience) {
                $roles = apply_filters('pdfp_watermark_exempt_roles', array('administrator'), get_the_ID());

                if ($logged_in) {
                    $user = wp_get_current_user();

                    foreach ((array) $roles as $role) {
                        if (in_array($role, (array) $user->roles, true)) {
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        /**
         * Turn stored meta into the config the front end consumes.
         *
         * Returns an empty array when this visitor shouldn't see a mark, so the
         * renderer has nothing to strip rather than something to hide.
         *
         * IMPORTANT: visitor tokens are left UNRESOLVED and the config is flagged
         * dynamic. Resolving them here would bake one visitor's email into a
         * full-page cache and serve it to the next person.
         */
        public static function pdfp_watermark_resolve($config, $post_id = 0)
        {
            $config = wp_parse_args((array) $config, array(
                'enabled'    => false,
                'markType'   => 'text',
                'theme'      => 'confidential',
                'text'       => 'CONFIDENTIAL',
                'image'      => '',
                'imageStyle' => '',
                'color'      => '',
                'coverage'   => '',
                'position'   => '',
                'strength'   => '',
                'size'       => '',
                'angle'      => '',
                'apply'      => array('screen'),
                'pages'      => 'all',
                'audience'   => 'everyone',
                'antileak'   => false,
                'stamp'      => false,
                'lock'       => false,
                'dynamic'    => false,
            ));

            if (empty($config['enabled'])) {
                return array('enabled' => false);
            }

            // Clamp every token to a value the renderer knows. Meta can predate this
            // release, be hand-edited, or arrive from an import, and a stray value must
            // degrade to the default rather than render something broken.
            $allowed = array(
                'markType'   => array('text', 'image', 'both'),
                'imageStyle' => array('original', 'grayscale', 'white', 'black'),
                'coverage'   => array('off', 'sparse', 'normal', 'dense'),
                'strength'   => array('faint', 'subtle', 'medium', 'strong', 'solid'),
                'size'       => array('small', 'medium', 'large', 'fit'),
                'angle'      => array('diagonal', 'steep', 'flat', 'upright'),
                'pages'      => array('all', 'first', 'except-first'),
                'audience'   => array('everyone', 'except-admin', 'guests'),
                'position'   => array(
                    'top left', 'top center', 'top right',
                    'center left', 'center', 'center right',
                    'bottom left', 'bottom center', 'bottom right',
                ),
            );
            $fallback = array(
                'markType' => 'text', 'imageStyle' => 'grayscale', 'coverage' => 'normal',
                'strength' => 'subtle', 'size' => 'medium', 'angle' => 'diagonal',
                'pages' => 'all', 'audience' => 'everyone', 'position' => 'center',
            );

            foreach ($allowed as $key => $valid) {
                if (!in_array($config[$key], $valid, true)) {
                    $config[$key] = $fallback[$key];
                }
            }

            // "Watermark on, but applied to nothing" is never a state anyone wants, and
            // it is what an unsaved or emptied checkbox group looks like. Fall back to
            // the viewer so enabling the feature always produces a visible mark.
            $config['apply'] = array_values(array_intersect(
                array_map('strval', (array) $config['apply']),
                array('screen', 'print', 'download')
            ));

            if (empty($config['apply'])) {
                $config['apply'] = array('screen');
            }

            // The Anti-Leak group is a gate, not a setting: with it off, the two switches
            // it hides must not apply. Enforced here so the block editor and the metabox
            // cannot disagree -- the metabox hides them with a CSF dependency, the block
            // sidebar hides them in React, and both funnel through this.
            if (empty($config['antileak'])) {
                $config['stamp'] = false;
                $config['lock']  = false;
            }

            $themes = self::pdfp_watermark_themes();

            if (!isset($themes[$config['theme']])) {
                $config['theme'] = 'confidential';
            }

            // Entitlement. Free gets the TEXT mark and the text themes; the logo marks
            // and the Custom theme stay Pro. Clamped HERE, not in the two admin UIs,
            // because this resolver is the single point every path funnels through --
            // block, shortcode and metabox alike. So a lapsed licence, an import or
            // hand-edited meta degrades to a look this build is allowed to draw instead
            // of rendering a Pro one for free.
            // This build only ever draws the text mark and a free theme.
            {
                $config['markType'] = 'text';
                $config['image']    = '';
                // Apply To and Pages stay as saved -- they only route a mark this build may
                // already draw. Who Sees It does not: it is the row that hands some visitors
                // an unmarked document, so free always marks everyone.
                $config['audience'] = 'everyone';

                if (!in_array($config['theme'], self::pdfp_watermark_free_themes(), true)) {
                    $config['theme'] = 'confidential';
                }
            }

            // A stored theme that can't render the chosen mark type would show
            // nothing at all, so clamp to the first theme that can -- the same
            // rule the panel applies when you switch Mark Type.
            $theme = $themes[$config['theme']];

            if (!in_array($config['markType'], (array) $theme['types'], true)) {
                foreach ($themes as $key => $candidate) {
                    if (in_array($config['markType'], (array) $candidate['types'], true)) {
                        $config['theme'] = $key;
                        break;
                    }
                }
            }

            if (!self::pdfp_watermark_audience_allows($config['audience'])) {
                return array('enabled' => false);
            }

            // Static tokens now; visitor tokens deferred.
            $config['text'] = strtr((string) $config['text'], self::pdfp_watermark_static_tokens($post_id));

            $needs_visitor = (bool) $config['stamp'];

            foreach (self::pdfp_watermark_dynamic_tokens() as $token) {
                if (false !== strpos($config['text'], $token)) {
                    $needs_visitor = true;
                    break;
                }
            }

            $config['dynamic'] = $needs_visitor;

            if (!apply_filters('pdfp_watermark_should_apply', true, $config, $post_id)) {
                return array('enabled' => false);
            }

            return apply_filters('pdfp_watermark_config', $config, $post_id);
        }

    }
}