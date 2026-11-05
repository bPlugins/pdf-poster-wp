<?php

namespace PDFPro\Base;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('PDFPro\Base\PDFP_PDFPoster')) {
    class PDFP_PDFPoster
    {
        protected static $_instance = null;
        protected $post_type = 'pdfposter';

        /**
         * construct function
         */
        public function __construct()
        {
            add_action('init', [$this, 'init']);
            if (is_admin()) {
                add_action('admin_menu', [$this, 'arrowAddNewSubmenu'], 999);

                add_filter('post_row_actions', [$this, 'pdfp_remove_row_actions'], 10, 2);

                add_filter('manage_pdfposter_posts_columns', [$this, 'pdfp_columns_head_only_podcast'], 10);
                add_action('manage_pdfposter_posts_custom_column', [$this, 'pdfp_columns_content_only_podcast'], 10, 2);
                add_filter('post_updated_messages', [$this, 'pdfp_updated_messages']);

                add_action('admin_head-post.php', [$this, 'pdfp_hide_publishing_actions']);
                add_action('admin_head-post-new.php', [$this, 'pdfp_hide_publishing_actions']);
                add_filter('gettext', [$this, 'pdfp_change_publish_button'], 10, 2);

                add_filter('filter_block_editor_meta_boxes', [$this, 'remove_metabox']);
                add_action('use_block_editor_for_post', [$this, 'forceGutenberg'], 10, 2);


                add_action('edit_form_after_title', [$this, 'shortcode_area']);

                // Sits in the side column directly under Save. post_submitbox_misc_actions
                // would have been the obvious hook, but pdfp_hide_publishing_actions()
                // sets #misc-publishing-actions to display:none for this post type --
                // anything rendered there is invisible.
                add_action('add_meta_boxes', [$this, 'analytics_links_box']);

                // A box named in the user's stored meta-box order is drawn from the
                // 'sorted' bucket, which WordPress renders ahead of 'core' -- so one
                // saved drag would pin this panel wherever it was dropped and the
                // registered priority would stop meaning anything. Dropping just our id
                // out of the stored string returns it to its priority while leaving every
                // other box the user arranged untouched. Mirrors what PDFP_SidebarCards
                // does for its own two cards.
                add_filter('get_user_option_meta-box-order_' . $this->post_type, [$this, 'release_analytics_box']);

                // add_action('add_meta_boxes', [$this, 'myplugin_add_meta_box']);
            }
        }

        /**
         * Create instance function
         */
        public static function instance()
        {
            if (self::$_instance === null) {
                self::$_instance = new self();
            }
            return self::$_instance;
        }

        /**
         * init
         */
        public function init()
        {

            register_post_type(
                'pdfposter',
                array(
                    'labels' => array(
                        'name' => __('PDF Poster', 'pdf-poster'),
                        'singular_name' => __('PDF Poster', 'pdf-poster'),
                        'add_new' => __('Add New PDF', 'pdf-poster'),
                        'add_new_item' => __('Add New', 'pdf-poster'),
                        'edit_item' => __('Edit', 'pdf-poster'),
                        'new_item' => __('New PDF', 'pdf-poster'),
                        'view_item' => __('View PDF', 'pdf-poster'),
                        'search_items' => __('Search PDF', 'pdf-poster'),
                        'all_items' => __('All PDF Posters', 'pdf-poster'),
                        'not_found' => __('Sorry, we couldn\'t find the PDF file you are looking for.', 'pdf-poster')
                    ),
                    'public' => false,
                    'show_ui' => true,
                    // 'publicly_queryable' => true,
                    // 'exclude_from_search' => true,
                    'show_in_rest' => true,
                    'menu_position' => 14,
                    'menu_icon' => 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBNSVQuIE1hZGUgYnkgR2FydWRhIFRlY2hub2xvZ3k6IGh0dHBzOi8vZ2l0aHViLmNvbS9nYXJ1ZGF0ZWNobm9sb2d5ZGV2ZWxvcGVycy9za2V0Y2gtaWNvbnMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSItNCAwIDQwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMjUuNjY4NiAyNi4wOTYyQzI1LjE4MTIgMjYuMjQwMSAyNC40NjU2IDI2LjI1NjMgMjMuNjk4NCAyNi4xNDVDMjIuODc1IDI2LjAyNTYgMjIuMDM1MSAyNS43NzM5IDIxLjIwOTYgMjUuNDAzQzIyLjY4MTcgMjUuMTg4OCAyMy44MjM3IDI1LjI1NDggMjQuODAwNSAyNS42MDA5QzI1LjAzMTkgMjUuNjgyOSAyNS40MTIgMjUuOTAyMSAyNS42Njg2IDI2LjA5NjJaTTE3LjQ1NTIgMjQuNzQ1OUMxNy4zOTUzIDI0Ljc2MjIgMTcuMzM2MyAyNC43Nzc2IDE3LjI3NzYgMjQuNzkzOUMxNi44ODE1IDI0Ljc2MjIgMTYuNDk2MSAyNS4wMDY5IDE2LjEyNDcgMjUuMTAwNUwxNS42MjM5IDI1LjIyNzVDMTQuNjE2NSAyNS40ODI0IDEzLjU4NjUgMjUuNzQyOCAxMi41NjkyIDI2LjA1MjlDMTIuOTU1OCAyNS4xMjA2IDEzLjMxNSAyNC4xNzggMTMuNjY2NyAyMy4yNTY0QzEzLjkyNzEgMjIuNTc0MiAxNC4xOTMgMjEuODc3MyAxNC40NjggMjEuMTg5NEMxNC42MDc1IDIxLjQxOTggMTQuNzUzMSAyMS42NTAzIDE0LjkwNDYgMjEuODgxNEMxNS41OTQ4IDIyLjk3MzYgMTYuNDk2MiAyMy45MDQ1IDE3LjQ1NTIgMjQuNzQ1OVpNMTQuODkyNyAxNC4yMzI2Wk05LjYzMzQ3IDI4LjgwNTRDOS4zODE0OCAyOS4yNTYyIDkuMTI0MjYgMjkuNjc4MiA4Ljg2MDYzIDMwLjA3NjdDOC4yMjQ0MiAzMS4wMzU1IDcuMTgzOTMgMzIuMDYyMSA2LjY0OTQxIDMyLjA2MjFDNi41OTY4MSAzMi4wNjIxIDYuNTMzMTYgMzIuMDUzNiA2LjQ0MDE1IDMxLjk1NTRDNi4zODAyOCAzMS44OTI2IDYuMzcwNjkgMzEuODQ3NiA2LjM3MzU5IDMxLjc4NjJDNi4zOTE2MSAzMS40MzM3IDYuODU4NjcgMzAuODA1OSA3LjUzNTI3IDMwLjIyMzhDOC4xNDkzOSAyOS42OTU3IDguODQzNTIgMjkuMjI2MiA5LjYzMzQ3IDI4LjgwNTRaTTI3LjM3MDYgMjYuMTQ2MUMyNy4yODg5IDI0Ljk3MTkgMjUuMzEyMyAyNC4yMTg2IDI1LjI5MjggMjQuMjExNkMyNC41Mjg3IDIzLjk0MDcgMjMuNjk4NiAyMy44MDkxIDIyLjc1NTIgMjMuODA5MUMyMS43NDUzIDIzLjgwOTEgMjAuNjU2NSAyMy45NTUyIDE5LjI1ODIgMjQuMjgxOUMxOC4wMTQgMjMuMzk5OSAxNi45MzkyIDIyLjI5NTcgMTYuMTM2MiAyMS4wNzMzQzE1Ljc4MTYgMjAuNTMzMiAxNS40NjI4IDE5Ljk5NDEgMTUuMTg0OSAxOS40Njc1QzE1Ljg2MzMgMTcuODQ1NCAxNi40NzQyIDE2LjEwMTMgMTYuMzYzMiAxNC4xNDc5QzE2LjI3MzcgMTIuNTgxNiAxNS41NjcyIDExLjUyOTUgMTQuNjA2OSAxMS41Mjk1QzEzLjk0OCAxMS41Mjk1IDEzLjM4MDcgMTIuMDE3NSAxMi45MTk0IDEyLjk4MTNDMTIuMDk2NSAxNC42OTg3IDEyLjMxMjggMTYuODk2MiAxMy41NjIgMTkuNTE4NEMxMy4xMTIxIDIwLjU3NTEgMTIuNjk0MSAyMS42NzA2IDEyLjI4OTUgMjIuNzMxMUMxMS43ODYxIDI0LjA0OTggMTEuMjY3NCAyNS40MTAzIDEwLjY4MjggMjYuNzA0NUM5LjA0MzM0IDI3LjM1MzIgNy42OTY0OCAyOC4xMzk5IDYuNTc0MDIgMjkuMTA1N0M1LjgzODcgMjkuNzM3MyA0Ljk1MjIzIDMwLjcwMjggNC45MDE2MyAzMS43MTA3QzQuODc2OTMgMzIuMTg1NCA1LjAzOTY5IDMyLjYyMDcgNS4zNzA0NCAzMi45Njk1QzUuNzIxODMgMzMuMzM5OCA2LjE2MzI5IDMzLjUzNDggNi42NDg3IDMzLjUzNTRDOC4yNTE4OSAzMy41MzU0IDkuNzk0ODkgMzEuMzMyNyAxMC4wODc2IDMwLjg5MDlDMTAuNjc2NyAzMC4wMDI5IDExLjIyODEgMjkuMDEyNCAxMS43Njg0IDI3Ljg2OTlDMTMuMTI5MiAyNy4zNzgxIDE0LjU3OTQgMjcuMDExIDE1Ljk4NSAyNi42NTYyTDE2LjQ4ODQgMjYuNTI4M0MxNi44NjY4IDI2LjQzMjEgMTcuMjYwMSAyNi4zMjU3IDE3LjY2MzUgMjYuMjE1M0MxOC4wOTA0IDI2LjA5OTkgMTguNTI5NiAyNS45ODAyIDE4Ljk3NiAyNS44NjY1QzIwLjQxOTMgMjYuNzg0NCAyMS45NzE0IDI3LjM4MzEgMjMuNDg1MSAyNy42MDI4QzI0Ljc2MDEgMjcuNzg4MyAyNS44OTI0IDI3LjY4MDcgMjYuNjU4OSAyNy4yODExQzI3LjM0ODYgMjYuOTIxOSAyNy4zODY2IDI2LjM2NzYgMjcuMzcwNiAyNi4xNDYxWk0zMC40NzU1IDM2LjI0MjhDMzAuNDc1NSAzOC4zOTMyIDI4LjU4MDIgMzguNTI1OCAyOC4xOTc4IDM4LjUzMDFIMC43NDQ4NkMxLjYwMjI0IDM4LjUzMDEgMS40NzMyMiAzNi42MjE4IDEuNDY5MTMgMzYuMjQyOEwxLjQ2ODg0IDMuNzU2NDJDMS40Njg4NCAxLjYwMzkgMy4zNjc2MyAxLjQ3MzQgMy4zNjc2MyAxLjQ2OTA4SDIwLjI2M0wyMC4yNzE4IDEuNDc3OFY3LjkyMzk2QzIwLjI3MTggOS4yMTc2MyAyMS4wNTM5IDExLjY2NjkgMjQuMDE1OCAxMS42NjY5SDMwLjQyMDNMMzAuNDc1MyAxMS43MjE4TDMwLjQ3NTUgMzYuMjQyOFpNMjguOTU3MiAxMC4xOTc2SDI0LjAxNjlDMjEuODc0OSAxMC4xOTc2IDIxLjc0NTMgOC4yOTk2OSAyMS43NDI0IDcuOTI0MTdWMi45NTMwN0wyOC45NTcyIDEwLjE5NzZpTTMxLjk0NDcgMzYuMjQyOFYxMS4xMTU3TDIxLjc0MjQgMC44NzEwMjJWLjgyMzM1N0gyMS42OTM2TDIwLjg3NDIgMEgzLjc0NDkxQzIuNDQ5NTQgMCAwIDAuNzg1MzM2IDAgMy43NTcxMVYzNi4yNDM1QzAgMzcuNTQyNyAwLjc4Mjk1NiA0MCAzLjc0NDkxIDQwSDI4LjIwMDFDMjkuNDk1MiAzOS45OTk3IDMxLjk0NDcgMzkuMjE0MyAzMS45NDQ3IDM2LjI0MjhWIiBmaWxsPSIjRUI1NzU3Ii8+Cjwvc3ZnPg==',
                    'has_archive' => false,
                    'hierarchical' => false,
                    'capability_type' => 'post',
                    'rewrite' => array('slug' => 'pdfposter'),
                    'supports' => array('title', 'editor'),
                    'template' => [
                        ['pdfp/pdfposter']
                    ],
                    'template_lock' => 'all',
                )
            );
        }

        /**
         * Remove Row
         */
        function pdfp_remove_row_actions($idtions)
        {
            global $post;
            if (!$post) {
                return $idtions;
            }
            if ($post->post_type == $this->post_type) {
                unset($idtions['view']);
                unset($idtions['inline hide-if-no-js']);
            }
            return $idtions;
        }

        // CREATE TWO FUNCTIONS TO HANDLE THE COLUMN
        function pdfp_columns_head_only_podcast($defaults)
        {
            unset($defaults['date']);
            $defaults['shortcode'] = __('ShortCode', 'pdf-poster');
            $defaults['raw_shortCode'] = esc_html__('ShortCode For Raw PDF View', 'pdf-poster');
            // Document Insights. Placed before Date so the two numbers sit together at
            // the end of the row, which is where a reader's eye lands when comparing.
            //
            // The heading states the period rather than badging the column: the figures
            // are real, but they reset at midnight, and a bare "Views" over a number that
            // does that would be the one genuinely misleading thing here.
            $defaults['pdfp_views'] = esc_html__('Views today', 'pdf-poster');
            $defaults['pdfp_downloads'] = esc_html__('Downloads today', 'pdf-poster');
            $defaults['date'] = __('Date', 'pdf-poster');
            return $defaults;
        }

        function pdfp_columns_content_only_podcast($column_name, $post_ID)
        {
            if ($column_name == 'shortcode') {
                $this->render_shortcode_chip("[pdf id='" . $post_ID . "']");
            }
            if ($column_name == 'raw_shortCode') {
                $this->render_shortcode_chip("[raw_pdf id='" . $post_ID . "']");
            }
            if ($column_name === 'pdfp_views' || $column_name === 'pdfp_downloads') {
                $this->render_count_cell($post_ID, $column_name);
            }
        }

        /**
         * One Document Insights cell: today's figure, from one batched query for the
         * whole screen (pdfp_today_rows_by_post() caches per request).
         *
         * A document that has never been counted shows an em dash rather than a zero --
         * "not measured yet" and "measured, nobody looked" are different facts, and a
         * hard 0 on a poster published an hour ago reads as a bug report waiting to
         * happen. The `_pdfp_views` / `_pdfp_downloads` meta mirror is what tells the two
         * apart: it is written the first time a document is ever counted.
         */
        protected function render_count_cell($post_ID, $column_name)
        {
            if (!\PDFPro\Helper\PDFP_Functions::pdfp_tracking_enabled()) {
                echo '<span aria-hidden="true" style="color:#a7aaad">&mdash;</span>'
                    . '<span class="screen-reader-text">' . esc_html__('Counting is switched off', 'pdf-poster') . '</span>';
                return;
            }

            $rows = \PDFPro\Helper\PDFP_Functions::pdfp_today_rows_by_post();
            $field = $column_name === 'pdfp_views' ? 'views' : 'downloads';

            if (isset($rows[(int) $post_ID])) {
                echo '<strong>' . esc_html(number_format_i18n((int) $rows[(int) $post_ID][$field])) . '</strong>';
                return;
            }

            // Nothing today. A document that HAS been counted before genuinely scored
            // zero today and should say so; one that never has is not measured yet.
            $meta_key = $column_name === 'pdfp_views' ? '_pdfp_views' : '_pdfp_downloads';
            $raw = get_post_meta($post_ID, $meta_key, true);

            if (!($raw === '' || $raw === null)) {
                echo '<span style="color:#a7aaad">0</span>';
                return;
            }

            echo '<span aria-hidden="true" style="color:#a7aaad">&mdash;</span>'
                . '<span class="screen-reader-text">' . esc_html__('Not counted yet', 'pdf-poster') . '</span>';
        }

        /**
         * "Analytics" box under Save, in the classic editor.
         *
         * Shows today's real views and downloads for this document. What Pro adds is
         * reading the history back, and the panel itself says so.
         */
        public function analytics_links_box()
        {
            add_meta_box(
                'pdfp_analytics_links',
                // Metabox titles are printed unescaped, so the existing .pdfp-new-badge
                // span works here as it does in a CSF section title (admin.css is
                // enqueued on every admin screen, so the chip is styled, not bare text).
                //
                // Wrapped in one span on purpose: WordPress drops the title straight into
                // <h2 class="hndle">, which is display:flex; justify-content:space-between.
                // Left unwrapped, the text and the badge become two flex items and get
                // shoved to opposite ends of the header. Styled inline rather than with a
                // class, to add nothing new to admin.scss.
                //
                // NEW, never PRO: the box shows today's real figures, so badging it PRO
                // would label live data as something the reader cannot have.
                '<span style="display:inline-flex;align-items:center;gap:2px;">'
                    . esc_html__('Analytics', 'pdf-poster')
                    . \PDFPro\Helper\PDFP_Functions::pdfp_new_badge()
                    . '</span>',
                [$this, 'render_analytics_links'],
                $this->post_type,
                'side',
                // 'core', not 'low'. do_meta_boxes() renders high, sorted, core, default,
                // low -- WordPress registers submitdiv at 'core' before the
                // add_meta_boxes hook fires, so a later 'core' box follows Save, and the
                // compatibility card at 'default' follows this one. That is the intended
                // default column: Save, Analytics, Page Builder Support.
                'core'
            );
        }

        /**
         * Hand the Analytics panel back to its registered priority.
         *
         * @param array|mixed $order
         * @return array|mixed
         */
        public function release_analytics_box($order)
        {
            if (!is_array($order) || empty($order['side'])) {
                return $order;
            }

            $kept = array_diff(explode(',', $order['side']), ['pdfp_analytics_links']);
            $order['side'] = implode(',', $kept);

            return $order;
        }

        /**
         * Today's readout, then the one action that follows from it.
         *
         * A link rather than a button: this build has no upgrade modal, so the only useful
         * click is the pricing screen, and it says how many days are waiting behind it --
         * a fact about this site, checkable against the panel above, rather than a
         * sentence about a price list.
         */
        public function render_analytics_links($post)
        {
            \PDFPro\Helper\PDFP_Functions::pdfp_render_insights_panel($post->ID);

            $doc = \PDFPro\Helper\PDFP_Functions::pdfp_doc_key('', $post->ID);
            $days = (int) \PDFPro\Helper\PDFP_Functions::pdfp_recorded_history($doc)['days'];
            $tracking = \PDFPro\Helper\PDFP_Functions::pdfp_tracking_enabled();
            ?>
            <div class="pdfp-analytics-links">
                <a class="button button-primary button-large"
                    href="<?php echo esc_url(\PDFPro\Helper\PDFP_Functions::pricing_url()); ?>">
                    <?php
                    echo esc_html(
                        $days > 0
                            ? sprintf(
                                /* translators: %s: number of days of history already recorded */
                                _n('Unlock my %s day', 'Unlock my %s days', $days, 'pdf-poster'),
                                number_format_i18n($days)
                            )
                            : __('See the full report with Pro', 'pdf-poster')
                    );
                    ?>
                </a>

                <?php
                // Only when there is something to act on. While counting is on the panel
                // above already says since when, and "counted automatically" repeated
                // under it was a sentence spending three lines of a 260px column to say
                // nothing the reader could use.
                if (!$tracking) {
                    $pdfp_settings_link = '<a href="'
                        . esc_url(admin_url('edit.php?post_type=pdfposter&page=fpdf-settings')) . '">'
                        . esc_html__('Turn it on in Settings', 'pdf-poster') . '</a>';
                    ?>
                    <p class="pdfp-analytics-links-note">
                        <?php
                        echo wp_kses_post(sprintf(
                            /* translators: %s: link to the plugin settings screen */
                            __('Counting is switched off for this site. %s', 'pdf-poster'),
                            $pdfp_settings_link
                        ));
                        ?>
                    </p>
                    <?php
                }
                ?>
            </div>
            <?php
        }

        /**
         * A shortcode in the list table: the value itself, click to copy.
         *
         * It used to be a full-width filled button reading "Copy Shortcode", which spent
         * the widest column in the table on a label while hiding the one thing the column
         * exists to show -- and told you nothing about which id you were about to copy.
         * A monospaced chip shows the value, sizes to its content, and still copies on
         * click.
         *
         * Kept as an <input> rather than a <button>: the copy path selects the field and
         * falls back to execCommand where the async clipboard API is unavailable, and a
         * button has nothing to select.
         *
         * @param string $shortcode
         * @return void
         */
        protected function render_shortcode_chip($shortcode)
        {
            // The icon carries pointer-events:none so a click on it still lands on the
            // input -- which is what the copy handler is bound to, and what the
            // execCommand fallback needs to be able to select.
            $icon = '<svg class="pdfp_front_shortcode_icon" viewBox="0 0 24 24" fill="none"'
                . ' stroke="currentColor" stroke-width="2" stroke-linecap="round"'
                . ' stroke-linejoin="round" aria-hidden="true" focusable="false">'
                . '<rect x="9" y="9" width="11" height="11" rx="1"></rect>'
                . '<path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"></path>'
                . '</svg>';

            printf(
                '<span class="pdfp_front_shortcode">'
                    . '<input class="pdfp_front_shortcode_input" type="text" readonly value="%1$s"'
                    . ' data-value="%1$s" size="%2$d" aria-label="%3$s" />'
                    . '%5$s'
                    . '<span class="htooltip">%4$s</span>'
                    . '</span>',
                esc_attr($shortcode),
                (int) (strlen($shortcode) + 1),
                esc_attr(sprintf(
                    /* translators: %s: the shortcode, e.g. [pdf id='12'] */
                    __('Copy shortcode %s', 'pdf-poster'),
                    $shortcode
                )),
                esc_html__('Copy to clipboard', 'pdf-poster'),
                wp_kses(
                    $icon,
                    array(
                        'svg' => array('class' => true, 'viewbox' => true, 'fill' => true, 'stroke' => true,
                            'stroke-width' => true, 'stroke-linecap' => true, 'stroke-linejoin' => true,
                            'aria-hidden' => true, 'focusable' => true),
                        'rect' => array('x' => true, 'y' => true, 'width' => true, 'height' => true, 'rx' => true),
                        'path' => array('d' => true),
                    )
                )
            );
        }

        function pdfp_updated_messages($messages)
        {
            $messages[$this->post_type][1] = __('Player updated ', 'pdf-poster');
            return $messages;
        }

        public function pdfp_hide_publishing_actions()
        {
            global $post;
            if (!$post) {
                return;
            }
            if ($post->post_type == $this->post_type) {
                echo '
                <style type="text/css">
                    #misc-publishing-actions,
                    #minor-publishing-actions{
                        display:none;
                    }
                </style>
            ';
            }
        }

        function remove_metabox($metaboxs)
        {
            global $post;
            $screen = get_current_screen();

            if (!$screen) {
                return $metaboxs;
            }

            if ($screen->post_type === $this->post_type) {
                return false;
            }
            return $metaboxs;
        }

        public function forceGutenberg($use, $post)  {
            $option = get_option('fpdf_option', []);
            if (isset($option['pdfp_gutenberg_enable'])) {
                $gutenberg = (bool) $option['pdfp_gutenberg_enable'];
            } else {
                $gutenberg = (bool) get_option('pdfp_gutenberg_enable', false);
            }
            $isGutenberg = (bool) get_post_meta($post->ID, 'isGutenberg', true);
            $pluginUpdated = 1630223686;
            $publishDate = get_the_date('U', $post);
            $currentTime = current_time("U");

            if ($this->post_type === $post->post_type) {
                if ($gutenberg) {
                    if ($post->post_status == 'auto-draft') {
                        update_post_meta($post->ID, 'isGutenberg', true);
                        return true;
                    } else {
                        if ($isGutenberg) {
                            return true;
                        } else {
                            remove_post_type_support($this->post_type, 'editor');
                            return false;
                        }
                    }
                } else {
                    if ($isGutenberg) {
                        return true;
                    } else {
                        remove_post_type_support($this->post_type, 'editor');
                        return false;
                    }
                }
            }

            return $use;
        }

        function pdfp_change_publish_button($translation, $text)
        {
            if ($this->post_type == get_post_type())
                if ($text == 'Publish')
                    return 'Save';
            return $translation;
        }

        /**
         * register metabox
         */
        function myplugin_add_meta_box()
        {
            add_meta_box(
                'Shortcode',
                __('New Feature ! Quick Embed', 'pdf-poster'),
                [$this, 'pdfp_pro_shortcode_wid'],
                'pdfposter',
                'side',
                'default'
            );
        }

        function shortcode_area()
        {

            if ($this->post_type != get_post_type()) {
                return;
            }
            global $post;
            $id = $post->ID;

            $shortcode = "[pdf id='" . esc_attr($id) . "']";
            ?>
            <div class="pdfp_shortcode_area_after_title">
                <label><?php esc_html_e('Copy and paste this shortcode into your posts, pages and widget', 'pdf-poster'); ?></label>
                <div class="shortcode_area">
                    <button class="button button-bplugins button-large pdfp_shortcode_copy_btn"
                        data-clipboard-text="<?php echo esc_attr($shortcode) ?>"><?php echo esc_html($shortcode); ?></button>
                    <svg class='pdfp_shortcode_copy_btn' data-type="icon" data-clipboard-text='<?php echo esc_attr($shortcode) ?>'
                        width='22px' height='22px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M8 4V16C8 17.1046 8.89543 18 10 18L18 18C19.1046 18 20 17.1046 20 16V7.24162C20 6.7034 19.7831 6.18789 19.3982 5.81161L16.0829 2.56999C15.7092 2.2046 15.2074 2 14.6847 2H10C8.89543 2 8 2.89543 8 4Z'
                            stroke='#000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
                        <path d='M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V9C4 7.89543 4.89543 7 6 7H8'
                            stroke='#000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
                    </svg>
                </div>
            </div>
            <?php
        }

        function pdfp_pro_shortcode_wid()
        {
            $shortcode = "[pdf_embed url='your_file_url']";
            echo esc_html__('Now you can embed pdf without listing ! just use the Embed shortCode below, and start saving your time.', 'pdf-poster');
            echo '<br/><br/><input type="text" style="font-size: 12px; border: none; box-shadow: none; padding: 4px 8px; width:100%; background:#1e8cbe; color:white;"  onfocus="this.select();" readonly="readonly"  value="' . esc_attr($shortcode) . '" /><br/><br/>';
            echo '<p><a class="button button-primary button-large" href="admin.php?page=fpdf-settings" target="_blank">' . esc_html__('ShortCode Global Settings', 'pdf-poster') . '</a></p>';
        }


        /**
         * Add the ↳ arrow to the sidebar "Add New" submenu item only, not the page-title button.
         *
         * @return void
         */
        public function arrowAddNewSubmenu()
        {
            global $submenu;
            $menu_slug = 'edit.php?post_type=' . $this->post_type;
            if (empty($submenu[$menu_slug])) {
                return;
            }
            foreach ($submenu[$menu_slug] as &$item) {
                if (isset($item[2]) && 0 === strpos($item[2], 'post-new.php?post_type=' . $this->post_type)) {
                    $item[0] = '<span aria-hidden="true">&#8627;</span> ' . $item[0];
                    break;
                }
            }
            unset($item);
        }
    }
}
