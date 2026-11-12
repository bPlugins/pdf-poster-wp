<?php
/**
 * "PDF Poster" Elementor widget.
 * @package PDFPro
 */

namespace PDFPro\Integrations\Elementor;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Background;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;
use Elementor\Group_Control_Typography;
use Elementor\Widget_Base;
use PDFPro\Base\PDFP_EnqueueAssets;
use PDFPro\Base\PDFP_Shortcodes;
use PDFPro\Helper\PDFP_Functions as Utils;
use PDFPro\Integrations\PDFP_Elementor;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'PDFPro\Integrations\Elementor\PDFP_Elementor_Widget' ) ) {
    class PDFP_Elementor_Widget extends Widget_Base {

        const SHORTCODES = [ 'pdf', 'pdf_embed', 'raw_pdf' ];

        /** Same cap as the WPBakery element: the list is a real query. */
        const MAX_LISTED_POSTERS = 300;

        const WRAPPER = '{{WRAPPER}} .pdfp-elementor-widget';

        const FRAME = '.pdfp_wrapper:not(.pdfp_fullscreen_opened) .iframe_wrapper:not(:fullscreen)';

        public function get_name() {
            // Stored in _elementor_data. Never rename after release.
            return 'pdfp-pdf-poster';
        }

        public function get_title() {
            return __( 'PDF Poster', 'pdf-poster' );
        }

        public function get_icon() {
            // Painted by PDFP_Elementor::editor_styles().
            return 'pdfp-elementor-icon';
        }

        public function get_categories() {
            return [ PDFP_Elementor::CATEGORY ];
        }

        public function get_keywords() {
            return [ 'pdf', 'poster', 'flipbook', 'document', 'viewer', 'embed' ];
        }

        public function get_script_depends() {
            return [ 'pdfp-public', 'pdfp-pdfposter-view-script' ];
        }

        public function get_style_depends() {
            return [ 'pdfp-public', PDFP_Elementor::block_style_handle(), PDFP_Elementor::STYLE_HANDLE ];
        }

        /**
         * Output can differ per visitor (watermark placeholders such as {user_email}),
         * so Elementor's element cache must never store it.
         */
        protected function is_dynamic_content(): bool {
            return true;
        }

        /** Elementor 3.24+: drop the extra .elementor-widget-container div. */
        public function has_widget_inner_wrapper(): bool {
            return false;
        }

        protected function register_controls() {
            $this->register_source_controls();
            $this->register_viewer_controls();
            $this->register_size_controls();
            $this->register_container_style_controls();
            $this->register_title_style_controls();
            $this->register_button_style_controls();
            $this->register_popup_style_controls();
            $this->register_frame_style_controls();
        }

        /* ------------------------------------------------------------------------------ *
         * Content
         * ------------------------------------------------------------------------------ */

        private function register_source_controls() {
            $this->start_controls_section( 'section_source', [
                'label' => __( 'Source', 'pdf-poster' ),
                'tab'   => Controls_Manager::TAB_CONTENT,
            ] );

            $this->add_control( 'source', [
                'label'   => __( 'Show', 'pdf-poster' ),
                'type'    => Controls_Manager::CHOOSE,
                'default' => 'poster',
                'toggle'  => false,
                'options' => [
                    'poster'    => [ 'title' => __( 'Saved PDF Poster', 'pdf-poster' ), 'icon' => 'eicon-document-file' ],
                    'file'      => [ 'title' => __( 'PDF File / URL', 'pdf-poster' ), 'icon' => 'eicon-link' ],
                    'shortcode' => [ 'title' => __( 'Shortcode', 'pdf-poster' ), 'icon' => 'eicon-shortcode' ],
                ],
            ] );

            // Saved poster ---------------------------------------------------------------
            $this->add_control( 'poster_id', [
                'label'       => __( 'PDF Poster', 'pdf-poster' ),
                'type'        => Controls_Manager::SELECT2,
                'label_block' => true,
                'multiple'    => false,
                'options'     => $this->poster_options(),
                'condition'   => [ 'source' => 'poster' ],
            ] );

            $this->add_control( 'poster_edit', [
                'type'        => Controls_Manager::BUTTON,
                'text'        => __( 'Edit PDF Poster', 'pdf-poster' ),
                'button_type' => 'default',
                'event'       => 'pdfp:edit:poster',
                'show_label'  => false,
                'condition'   => [ 'source' => 'poster', 'poster_id!' => '' ],
            ] );

            $this->add_control( 'poster_links', [
                'type'            => Controls_Manager::RAW_HTML,
                'raw'             => sprintf(
                    '<a href="%1$s" target="_blank">%2$s</a> &nbsp;|&nbsp; <a href="%3$s" target="_blank">%4$s</a><br><br>%5$s',
                    esc_url( admin_url( 'post-new.php?post_type=pdfposter' ) ),
                    esc_html__( 'Add New', 'pdf-poster' ),
                    esc_url( admin_url( 'edit.php?post_type=pdfposter' ) ),
                    esc_html__( 'Manage all', 'pdf-poster' ),
                    esc_html__( 'Viewer, buttons and watermark come from the poster itself. Size and alignment below override it on this page only.', 'pdf-poster' )
                ),
                'content_classes' => 'elementor-descriptor',
                'condition'       => [ 'source' => 'poster' ],
            ] );

            // PDF file / URL -------------------------------------------------------------
            $this->add_control( 'file_media', [
                'label'       => __( 'PDF File', 'pdf-poster' ),
                'type'        => Controls_Manager::MEDIA,
                'media_types' => [ 'application/pdf' ],
                'dynamic'     => [ 'active' => true ],
                'condition'   => [ 'source' => 'file' ],
            ] );

            $this->add_control( 'file_url', [
                'label'       => __( 'Or PDF URL', 'pdf-poster' ),
                'type'        => Controls_Manager::URL,
                'options'     => false,
                'label_block' => true,
                'placeholder' => 'https://example.com/file.pdf',
                'dynamic'     => [ 'active' => true ],
                'description' => __( 'Used instead of the file above when filled. Google Drive and Dropbox links work too.', 'pdf-poster' ),
                'condition'   => [ 'source' => 'file' ],
            ] );

            // Shortcode ------------------------------------------------------------------
            $this->add_control( 'shortcode', [
                'label'       => __( 'Shortcode', 'pdf-poster' ),
                'type'        => Controls_Manager::TEXT,
                'label_block' => true,
                'placeholder' => '[pdf id="123"]',
                'dynamic'     => [ 'active' => true ],
                'description' => sprintf(
                    /* translators: 1: poster shortcode, 2: embed shortcode */
                    __( 'Paste a PDF Poster shortcode such as %1$s or %2$s.', 'pdf-poster' ),
                    '<code>[pdf id="123"]</code>',
                    '<code>[pdf_embed url="…"]</code>'
                ),
                'condition'   => [ 'source' => 'shortcode' ],
            ] );

            $this->end_controls_section();
        }

        /**
         * Inline options for the PDF File source -- the metabox's tabs, section for section
         * (General, Controls, Actions, Popup, Watermark, Social Share, Advanced,
         * Performance). The metabox's Styles tab is the Style tab here.
         *
         * Field keys are the metabox's own `_fpdf` keys wherever the widget did not
         * already ship a key of its own; file_meta() translates the older ones.
         *
         * Only what this build can do is registered. Pro settings are not shown locked or
         * greyed out anywhere in the panel (WordPress.org guideline 5: no locked features
         * in a hosted plugin); the card at the foot of General is the one place that
         * describes them.
         *
         * Defaults are the metabox's hard-coded fallbacks, never Settings > Preset:
         * Elementor does not store a setting left at its default, so a default that moved
         * with the preset would silently change widgets already on pages.
         */
        private function register_viewer_controls() {
            $file = [ 'source' => 'file' ];

            $this->register_general_controls( $file );
            $this->register_behaviour_controls( $file );
            $this->register_action_controls( $file );
            $this->register_cover_controls( $file );
            $this->register_popup_controls( $file );
            $this->register_watermark_controls( $file );
            $this->register_share_controls( $file );
            $this->register_advanced_controls( $file );
            $this->register_performance_controls( $file );
        }

        private function register_general_controls( array $file ) {
            $this->start_controls_section( 'section_viewer', [
                'label'     => __( 'General', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $this->add_control( 'viewer', [
                'label'   => __( 'Viewer', 'pdf-poster' ),
                'type'    => Controls_Manager::SELECT,
                'default' => 'default',
                'options' => $this->viewer_options(),
            ] );

            if ( Utils::pdfp_has_flipbook_engine() ) {
                $this->add_control( 'flipbook_source_type', [
                    'label'       => __( 'Viewer Source', 'pdf-poster' ),
                    'type'        => Controls_Manager::CHOOSE,
                    'default'     => 'pdf',
                    'toggle'      => false,
                    'options'     => [
                        'pdf'    => [ 'title' => __( 'PDF File', 'pdf-poster' ), 'icon' => 'eicon-document-file' ],
                        'images' => [ 'title' => __( 'Image Gallery', 'pdf-poster' ), 'icon' => 'eicon-gallery-grid' ],
                    ],
                    'description' => __( 'Build the flipbook or slider from the PDF or from an ordered set of images.', 'pdf-poster' ),
                    'condition'   => [ 'viewer' => [ 'flipbook', 'slider' ] ],
                ] );

                $this->add_control( 'flipbook_images', [
                    'label'       => __( 'Pages (Images)', 'pdf-poster' ),
                    'type'        => Controls_Manager::GALLERY,
                    'description' => __( 'In the order they should appear as pages.', 'pdf-poster' ),
                    'condition'   => [ 'viewer' => [ 'flipbook', 'slider' ], 'flipbook_source_type' => 'images' ],
                ] );
            }

            $this->add_control( 'title', [
                'label'     => __( 'Title', 'pdf-poster' ),
                'type'      => Controls_Manager::TEXT,
                'dynamic'   => [ 'active' => true ],
                'separator' => 'before',
            ] );

            $this->add_control( 'show_name', [
                'label'   => __( 'Display Title', 'pdf-poster' ),
                'type'    => Controls_Manager::SWITCHER,
                'default' => '',
            ] );

            $this->pro_features_card();

            $this->end_controls_section();
        }

        /** The metabox's "Controls" tab. */
        private function register_behaviour_controls( array $file ) {
            $this->start_controls_section( 'section_behaviour', [
                'label'     => __( 'Controls', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $this->switcher( 'keyboard_nav', __( 'Keyboard Navigation', 'pdf-poster' ), '', __( 'Left/Right arrow keys change pages.', 'pdf-poster' ) );

            $this->add_control( 'rtl_mode', [
                'label'       => __( 'RTL Layout', 'pdf-poster' ),
                'type'        => Controls_Manager::SELECT,
                'default'     => 'off',
                'options'     => [
                    'off'  => __( 'Off', 'pdf-poster' ),
                    'on'   => __( 'On', 'pdf-poster' ),
                    'auto' => __( 'Auto (site language)', 'pdf-poster' ),
                ],
            ] );

            $this->add_control( 'theme_mode', [
                'label'       => __( 'Viewer Theme', 'pdf-poster' ),
                'type'        => Controls_Manager::SELECT,
                'default'     => 'light',
                'options'     => [
                    'light' => __( 'Light', 'pdf-poster' ),
                    'dark'  => __( 'Dark', 'pdf-poster' ),
                    'auto'  => __( 'Auto (visitor\'s system)', 'pdf-poster' ),
                ],
                'description' => __( 'Toolbar and background only; never the PDF pages.', 'pdf-poster' ),
            ] );

            $this->switcher( 'flipbook_sound', __( 'Page Flip Sound', 'pdf-poster' ), 'yes', '', [ 'viewer' => 'flipbook' ] );

            $this->switcher( 'annotation_mode', __( 'Annotation Mode', 'pdf-poster' ), 'yes', __( 'Show notes, highlights, comments and links saved in the PDF.', 'pdf-poster' ), [ 'viewer' => 'default' ] );
            $this->switcher( 'open_links_in_new_tab', __( 'Open PDF Links in New Tab', 'pdf-poster' ), '', '', [ 'viewer' => 'default', 'annotation_mode' => 'yes' ] );

            $this->end_controls_section();
        }

        /** The metabox's "Actions" tab. */
        private function register_action_controls( array $file ) {
            $this->start_controls_section( 'section_actions', [
                'label'     => __( 'Actions', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            // An image-gallery flipbook has no file to print or download. Both halves are
            // needed: a gallery choice left behind after switching back to the Default
            // viewer must not hide these.
            $has_file = [
                'relation' => 'or',
                'terms'    => [
                    [ 'name' => 'viewer', 'operator' => '!in', 'value' => [ 'flipbook', 'slider' ] ],
                    [ 'name' => 'flipbook_source_type', 'operator' => '!==', 'value' => 'images' ],
                ],
            ];

            $this->switcher( 'print', __( 'Allow Printing', 'pdf-poster' ), '', '', $has_file );
            $this->switcher( 'download_button', __( 'Download Button', 'pdf-poster' ), '', '', $has_file );

            $this->switcher( 'fullscreen_button', __( 'Fullscreen Button', 'pdf-poster' ), 'yes', '', [], 'before' );

            $this->add_control( 'fullscreen_text', [
                'label'     => __( 'Fullscreen Label', 'pdf-poster' ),
                'type'      => Controls_Manager::TEXT,
                'default'   => __( 'View Fullscreen', 'pdf-poster' ),
                'condition' => [ 'fullscreen_button' => 'yes' ],
            ] );

            $this->end_controls_section();
        }

        /** The metabox's "Popup" tab. */
        /**
         * The metabox's "Cover" tab (Auto Thumbnail). Cover design is Pro: it is named in
         * a note here and in the PDF Poster Pro card, never registered as a control.
         */
        private function register_cover_controls( array $file ) {
            $this->start_controls_section( 'section_cover', [
                'label'     => __( 'Cover', 'pdf-poster' ) . ' <span class="pdfp-el-new">NEW</span>',
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $this->add_control( 'cover_first', [
                'label'       => __( 'Cover First', 'pdf-poster' ),
                'type'        => Controls_Manager::SELECT,
                'default'     => 'default',
                'options'     => [
                    'default' => __( 'Site default', 'pdf-poster' ),
                    'on'      => __( 'On', 'pdf-poster' ),
                    'off'     => __( 'Off', 'pdf-poster' ),
                ],
                'description' => __( 'Show the PDF\'s cover with an Open button; the viewer and the PDF load only when it is clicked. Works with every viewer. Not used with Popup. Covers are made automatically for PDFs in your Media Library.', 'pdf-poster' ),
            ] );

            $this->add_control( 'cover_btn_text', [
                'label'       => __( 'Button Text', 'pdf-poster' ),
                'type'        => Controls_Manager::TEXT,
                'placeholder' => __( 'Open document', 'pdf-poster' ),
                'dynamic'     => [ 'active' => true ],
                'condition'   => [ 'cover_first!' => 'off' ],
            ] );

            $this->add_control( 'cover_pro_note', [
                'type'            => Controls_Manager::RAW_HTML,
                'raw'             => sprintf(
                    '<strong>%1$s</strong> %2$s <a href="%3$s" target="_blank" rel="noopener">%4$s</a>',
                    esc_html__( 'Cover design', 'pdf-poster' ),
                    esc_html__( '(background, size, corners, shadow, and the Open button\'s position, colours and shape) is available in PDF Poster Pro.', 'pdf-poster' ),
                    esc_url( Utils::pricing_url() ),
                    esc_html__( 'See Pro', 'pdf-poster' )
                ),
                'content_classes' => 'pdfp-el-covernote',
                'separator'       => 'before',
                'condition'       => [ 'cover_first!' => 'off' ],
            ] );

            $this->end_controls_section();
        }

        private function register_popup_controls( array $file ) {
            $this->start_controls_section( 'section_popup', [
                'label'     => __( 'Popup', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $this->add_control( 'popup', [
                'label'       => __( 'Enable Popup', 'pdf-poster' ),
                'type'        => Controls_Manager::SWITCHER,
                'default'     => '',
                'description' => __( 'Shows a button or an image; the PDF opens in a popup when it is clicked.', 'pdf-poster' ),
            ] );

            $this->add_control( 'popup_trigger_type', [
                'label'     => __( 'Trigger Type', 'pdf-poster' ),
                'type'      => Controls_Manager::CHOOSE,
                'default'   => 'button',
                'toggle'    => false,
                'options'   => [
                    'button' => [ 'title' => __( 'Button', 'pdf-poster' ), 'icon' => 'eicon-button' ],
                    'image'  => [ 'title' => __( 'Image', 'pdf-poster' ), 'icon' => 'eicon-image' ],
                ],
                'condition' => [ 'popup' => 'yes' ],
            ] );

            // Shown for both types: PopupTrigger.js uses it as the image's alt text and as
            // the clickable label when no image is chosen.
            $this->add_control( 'popup_text', [
                'label'       => __( 'Trigger Text', 'pdf-poster' ),
                'type'        => Controls_Manager::TEXT,
                'default'     => __( 'Open PDF', 'pdf-poster' ),
                'dynamic'     => [ 'active' => true ],
                'description' => __( 'The button label. For an image, its alt text.', 'pdf-poster' ),
                'condition'   => [ 'popup' => 'yes' ],
            ] );

            $this->add_control( 'popup_image', [
                'label'       => __( 'Image', 'pdf-poster' ),
                'type'        => Controls_Manager::MEDIA,
                'media_types' => [ 'image' ],
                'dynamic'     => [ 'active' => true ],
                'description' => __( 'Without an image, the Trigger Text is shown as a clickable label instead.', 'pdf-poster' ),
                'condition'   => [ 'popup' => 'yes', 'popup_trigger_type' => 'image' ],
            ] );

            // Sized through Elementor selectors (not only the block attrs) so they can be
            // responsive. Empty keeps the block's 300 x 200px. The text fallback shares the
            // box, exactly as Style.js sizes it.
            $image = self::WRAPPER . ' .popup-trigger img, ' . self::WRAPPER . ' .popup-trigger-text';

            $this->add_responsive_control( 'popup_image_width', [
                'label'      => __( 'Image Width', 'pdf-poster' ),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%', 'vw' ],
                'range'      => [ 'px' => [ 'min' => 20, 'max' => 1200 ] ],
                'selectors'  => [ $image => 'width: {{SIZE}}{{UNIT}};' ],
                'condition'  => [ 'popup' => 'yes', 'popup_trigger_type' => 'image' ],
            ] );

            $this->add_responsive_control( 'popup_image_height', [
                'label'      => __( 'Image Height', 'pdf-poster' ),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%', 'vh' ],
                'range'      => [ 'px' => [ 'min' => 20, 'max' => 1200 ] ],
                'selectors'  => [ $image => 'height: {{SIZE}}{{UNIT}};' ],
                'condition'  => [ 'popup' => 'yes', 'popup_trigger_type' => 'image' ],
            ] );

            $this->switcher( 'popup_image_pdf_icon', __( 'Show PDF Icon', 'pdf-poster' ), 'yes', __( 'Shows a PDF icon with the trigger image.', 'pdf-poster' ), [ 'popup' => 'yes', 'popup_trigger_type' => 'image' ] );

            $this->end_controls_section();
        }

        /**
         * The metabox's "Watermark & Branding" tab: the text mark and the free themes.
         * pdfp_watermark_resolve() clamps this build to them whatever is saved.
         */
        private function register_watermark_controls( array $file ) {
            $this->start_controls_section( 'section_watermark', [
                'label'     => __( 'Watermark', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $on = [ 'watermark_enable' => 'yes' ];

            $this->switcher( 'watermark_enable', __( 'Enable Watermark', 'pdf-poster' ), '', __( 'Stamp a text mark over the document.', 'pdf-poster' ) );

            $this->add_control( 'watermark_theme', [
                'label'       => __( 'Theme', 'pdf-poster' ),
                'type'        => Controls_Manager::SELECT,
                'default'     => 'confidential',
                'options'     => $this->watermark_theme_options(),
                'description' => __( 'Each theme sets the angle, repeat, weight and blend for you.', 'pdf-poster' ),
                'condition'   => $on,
            ] );

            $this->add_control( 'watermark_text', [
                'label'       => __( 'Text', 'pdf-poster' ),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'CONFIDENTIAL',
                'description' => __( 'Supports placeholders such as {site_name}, {date} and {user_email}.', 'pdf-poster' ),
                'condition'   => $on,
            ] );

            $this->add_control( 'watermark_apply', [
                'label'       => __( 'Apply To', 'pdf-poster' ),
                'type'        => Controls_Manager::SELECT2,
                'multiple'    => true,
                'label_block' => true,
                'default'     => [ 'screen' ],
                'options'     => [
                    'screen'   => __( 'Viewer', 'pdf-poster' ),
                    'print'    => __( 'Printing', 'pdf-poster' ),
                    'download' => __( 'Downloads', 'pdf-poster' ),
                ],
                'separator'   => 'before',
                'condition'   => $on,
            ] );

            $this->add_control( 'watermark_pages', [
                'label'     => __( 'Pages', 'pdf-poster' ),
                'type'      => Controls_Manager::SELECT,
                'default'   => 'all',
                'options'   => [
                    'all'          => __( 'All pages', 'pdf-poster' ),
                    'first'        => __( 'First page only', 'pdf-poster' ),
                    'except-first' => __( 'All except the cover', 'pdf-poster' ),
                ],
                'condition' => $on,
            ] );

            $this->end_controls_section();
        }

        /** The metabox's "Social Share" tab. */
        private function register_share_controls( array $file ) {
            $this->start_controls_section( 'section_share', [
                'label'     => __( 'Social Share', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $on = [ 'social_share' => 'yes' ];

            $this->switcher( 'social_share', __( 'Enable Sharing', 'pdf-poster' ), '' );

            $this->add_control( 'social_share_position', [
                'label'     => __( 'Share Position', 'pdf-poster' ),
                'type'      => Controls_Manager::CHOOSE,
                'default'   => 'top',
                'toggle'    => false,
                'options'   => [
                    'top'    => [ 'title' => __( 'Top', 'pdf-poster' ), 'icon' => 'eicon-v-align-top' ],
                    'bottom' => [ 'title' => __( 'Bottom', 'pdf-poster' ), 'icon' => 'eicon-v-align-bottom' ],
                ],
                'condition' => $on,
            ] );

            $this->switcher( 'social_share_facebook', __( 'Facebook', 'pdf-poster' ), 'yes', '', $on );
            $this->switcher( 'social_share_twitter', __( 'X (Twitter)', 'pdf-poster' ), 'yes', '', $on );
            $this->switcher( 'social_share_linkedin', __( 'LinkedIn', 'pdf-poster' ), 'yes', '', $on );
            $this->switcher( 'social_share_pinterest', __( 'Pinterest', 'pdf-poster' ), 'yes', '', $on );
            $this->switcher( 'social_share_mailto', __( 'Email', 'pdf-poster' ), 'yes', '', $on );

            $this->end_controls_section();
        }

        /**
         * The metabox's "Advanced" tab. Elementor's own Advanced tab classes the widget
         * wrapper; these reach the viewer itself, exactly as on a classic poster, and the
         * CSS needs no Elementor Pro.
         */
        private function register_advanced_controls( array $file ) {
            $this->start_controls_section( 'section_custom', [
                'label'     => __( 'Custom Class & CSS', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $this->add_control( 'custom_class', [
                'label'       => __( 'CSS Class', 'pdf-poster' ),
                'type'        => Controls_Manager::TEXT,
                'description' => __( 'Added to the viewer wrapper.', 'pdf-poster' ),
            ] );

            $this->add_control( 'custom_css', [
                'label'    => __( 'Custom CSS', 'pdf-poster' ),
                'type'     => Controls_Manager::CODE,
                'language' => 'css',
                'rows'     => 10,
            ] );

            $this->end_controls_section();
        }

        /** The metabox's "Performance & Reliability" tab. */
        private function register_performance_controls( array $file ) {
            $this->start_controls_section( 'section_performance', [
                'label'     => __( 'Performance & Reliability', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => $file,
            ] );

            $this->switcher( 'progressive_loading', __( 'Fast Loading', 'pdf-poster' ), 'yes', __( 'Stream large PDFs so the first page appears sooner. Turn off only if your host mishandles range requests.', 'pdf-poster' ) );

            $this->switcher( 'default_browser', __( 'Google Doc Viewer', 'pdf-poster' ), '', __( 'Use Google Doc Viewer as a fallback (recommended for Edge).', 'pdf-poster' ) );

            $this->end_controls_section();
        }

        /** A SWITCHER, the shape nearly every metabox toggle takes here. */
        private function switcher( $key, $label, $default = '', $description = '', array $condition = [], $separator = '' ) {
            $args = [
                'label'   => $label,
                'type'    => Controls_Manager::SWITCHER,
                'default' => $default,
            ];
            if ( $description !== '' ) {
                $args['description'] = $description;
            }
            if ( isset( $condition['terms'] ) ) {
                $args['conditions'] = $condition; // Elementor's and/or form
            } elseif ( $condition ) {
                $args['condition'] = $condition;
            }
            if ( $separator !== '' ) {
                $args['separator'] = $separator;
            }
            $this->add_control( $key, $args );
        }

        /**
         * What PDF Poster Pro adds to this widget, described in one place. Information
         * only: none of these settings exist in this panel, so nothing here is locked,
         * disabled or nagging -- it sits quietly at the foot of General and links to the
         * plugin's own pricing screen.
         */
        private function pro_features_card() {
            $features = [
                [
                    __( 'Protect Content', 'pdf-poster' ),
                    __( 'Block right-click, copying and text selection, and hide the download and print options.', 'pdf-poster' ),
                ],
                [
                    __( 'Secure Delivery', 'pdf-poster' ),
                    __( 'Stream the PDF through a one-time encrypted link, so its real address never reaches the page.', 'pdf-poster' ),
                ],
                [
                    __( 'Adobe and Scroll viewers', 'pdf-poster' ),
                    __( 'Adobe\'s own PDF viewer, and a continuous scroll view for long reports.', 'pdf-poster' ),
                ],
                [
                    __( 'Logo watermarks and leak tracing', 'pdf-poster' ),
                    __( 'Use your logo as the mark, every theme with your own colour, size and coverage, a per-visitor stamp, and choose who sees it.', 'pdf-poster' ),
                ],
                [
                    __( 'More viewer control', 'pdf-poster' ),
                    __( 'Reader Mode, a thumbnail sidebar, the page it opens on and the starting zoom.', 'pdf-poster' ),
                ],
                [
                    __( 'Your own buttons', 'pdf-poster' ),
                    __( 'Rename the Download button, move the buttons below the viewer, and open fullscreen in a new tab.', 'pdf-poster' ),
                ],
                [
                    __( 'Cover design', 'pdf-poster' ),
                    __( 'Style every PDF cover and its Open button: background, size, corners, shadow, colours and position, for the whole site or one widget.', 'pdf-poster' ),
                ],
                [
                    __( 'Dropbox and Google Drive', 'pdf-poster' ),
                    __( 'Pick PDFs straight from your cloud storage, and always load the latest version of a file.', 'pdf-poster' ),
                ],
            ];

            $items = '';
            foreach ( $features as $feature ) {
                $items .= '<dt>' . esc_html( $feature[0] ) . '</dt><dd>' . esc_html( $feature[1] ) . '</dd>';
            }

            $this->add_control( 'pro_features', [
                'type'            => Controls_Manager::RAW_HTML,
                'raw'             => sprintf(
                    '<div class="pdfp-el-procard"><div class="pdfp-el-procard__head"><i class="eicon-star" aria-hidden="true"></i><span>%1$s</span><span class="pdfp-el-pro">PRO</span></div><p class="pdfp-el-procard__intro">%2$s</p><dl>%3$s</dl><a class="pdfp-el-procard__btn" href="%4$s" target="_blank" rel="noopener">%5$s</a><div class="pdfp-el-procard__foot">%6$s</div></div>',
                    esc_html__( 'PDF Poster Pro', 'pdf-poster' ),
                    esc_html__( 'Everything in this widget is free. Pro adds these to the same widget:', 'pdf-poster' ),
                    $items,
                    esc_url( Utils::pricing_url() ),
                    esc_html__( 'See Pro features & pricing', 'pdf-poster' ),
                    esc_html__( '14-day refund policy', 'pdf-poster' )
                ),
                'content_classes' => 'pdfp-el-procard-wrap',
                'separator'       => 'before',
            ] );
        }

        private function viewer_options() {
            $options = [
                'default'  => __( 'Default (PDF.js)', 'pdf-poster' ),
                'flipbook' => __( 'FlipBook', 'pdf-poster' ),
                'slider'   => __( 'Slider', 'pdf-poster' ),
            ];

            if ( ! Utils::pdfp_has_flipbook_engine() ) {
                unset( $options['flipbook'], $options['slider'] );
            }

            return $options;
        }

        /** key => label for the watermark themes this build draws. */
        private function watermark_theme_options() {
            $free    = Utils::pdfp_watermark_free_themes();
            $options = [];
            foreach ( Utils::pdfp_watermark_themes() as $key => $theme ) {
                if ( in_array( $key, $free, true ) ) {
                    $options[ $key ] = $theme['label'];
                }
            }
            return $options;
        }

        private function register_size_controls() {
            $this->start_controls_section( 'section_size', [
                'label'     => __( 'Size', 'pdf-poster' ),
                'tab'       => Controls_Manager::TAB_CONTENT,
                'condition' => [ 'source' => [ 'poster', 'file' ] ],
            ] );

            $this->add_control( 'size_note', [
                'type'            => Controls_Manager::RAW_HTML,
                'raw'             => esc_html__( 'Leave empty to use the poster\'s own size.', 'pdf-poster' ),
                'content_classes' => 'elementor-descriptor',
                'condition'       => [ 'source' => 'poster' ],
            ] );

            $this->add_responsive_control( 'width', [
                'label'      => __( 'Width', 'pdf-poster' ),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => [ '%', 'px', 'vw' ],
                'range'      => [
                    '%'  => [ 'min' => 10, 'max' => 100 ],
                    'px' => [ 'min' => 100, 'max' => 2000 ],
                    'vw' => [ 'min' => 10, 'max' => 100 ],
                ],
            ] );

            $this->add_responsive_control( 'height', [
                'label'      => __( 'Height', 'pdf-poster' ),
                'type'       => Controls_Manager::SLIDER,
                'size_units' => [ 'px', 'vh' ],
                'range'      => [
                    'px' => [ 'min' => 100, 'max' => 2000 ],
                    'vh' => [ 'min' => 10, 'max' => 100 ],
                ],
            ] );

            // The block's own `alignment` attribute only sets justify-content on a wrapper
            // that is always 100% wide, so on its own it never moves a narrower viewer.
            // The widget aligns the parts directly: the frame by its margins, the buttons
            // by flex alignment. One value per device is written as custom properties on
            // the wrapper, and fixed rules read them, so a single responsive control can
            // drive several properties on two elements.
            //
            // The title is deliberately NOT included. The viewer centres it whatever the
            // alignment (public.css `.pdfp_wrapper p`), so including it made "Left" -- the
            // block's default -- pull the title left in the widget while the same poster
            // via shortcode kept it centred. Title alignment is its own control under
            // Style > Title.
            $this->add_responsive_control( 'alignment', [
                'label'                => __( 'Alignment', 'pdf-poster' ),
                'type'                 => Controls_Manager::CHOOSE,
                'options'              => [
                    'left'   => [ 'title' => __( 'Left', 'pdf-poster' ), 'icon' => 'eicon-text-align-left' ],
                    'center' => [ 'title' => __( 'Center', 'pdf-poster' ), 'icon' => 'eicon-text-align-center' ],
                    'right'  => [ 'title' => __( 'Right', 'pdf-poster' ), 'icon' => 'eicon-text-align-right' ],
                ],
                'selectors_dictionary' => [
                    'left'   => '--pdfp-el-ml: 0; --pdfp-el-mr: auto; --pdfp-el-flex: flex-start;',
                    'center' => '--pdfp-el-ml: auto; --pdfp-el-mr: auto; --pdfp-el-flex: center;',
                    'right'  => '--pdfp-el-ml: auto; --pdfp-el-mr: 0; --pdfp-el-flex: flex-end;',
                ],
                'selectors'            => [
                    self::WRAPPER                       => '{{VALUE}}',
                    self::WRAPPER . ' ' . self::FRAME   => 'margin-left: var(--pdfp-el-ml); margin-right: var(--pdfp-el-mr);',
                    // align-items too: below 576px public.css turns the row into a column.
                    self::WRAPPER . ' .cta_wrapper'     => 'justify-content: var(--pdfp-el-flex); align-items: var(--pdfp-el-flex);',
                ],
            ] );

            $this->end_controls_section();
        }

        /* ------------------------------------------------------------------------------ *
         * Style
         * ------------------------------------------------------------------------------ */

        private function register_container_style_controls() {
            $this->start_controls_section( 'style_container', [
                'label' => __( 'Container', 'pdf-poster' ),
                'tab'   => Controls_Manager::TAB_STYLE,
            ] );

            $this->add_group_control( Group_Control_Background::get_type(), [
                'name'     => 'container_background',
                'types'    => [ 'classic', 'gradient' ],
                'selector' => self::WRAPPER,
            ] );

            $this->add_responsive_control( 'container_padding', [
                'label'      => __( 'Padding', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', 'em', '%' ],
                'selectors'  => [ self::WRAPPER => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );

            $this->add_group_control( Group_Control_Border::get_type(), [
                'name'      => 'container_border',
                'selector'  => self::WRAPPER,
                'separator' => 'before',
            ] );

            $this->add_responsive_control( 'container_radius', [
                'label'      => __( 'Border Radius', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%' ],
                'selectors'  => [ self::WRAPPER => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}; overflow: hidden;' ],
            ] );

            $this->add_group_control( Group_Control_Box_Shadow::get_type(), [
                'name'     => 'container_shadow',
                'selector' => self::WRAPPER,
            ] );

            $this->end_controls_section();
        }

        private function register_title_style_controls() {
            $this->start_controls_section( 'style_title', [
                'label' => __( 'Title', 'pdf-poster' ),
                'tab'   => Controls_Manager::TAB_STYLE,
            ] );

            // Header.js gives the title an inline font-size and margin, hence !important.
            $title = self::WRAPPER . ' .pdfp_header p';

            // Empty = the viewer's own centred title, same as the block and shortcode.
            $this->add_responsive_control( 'title_align', [
                'label'     => __( 'Alignment', 'pdf-poster' ),
                'type'      => Controls_Manager::CHOOSE,
                'options'   => [
                    'left'   => [ 'title' => __( 'Left', 'pdf-poster' ), 'icon' => 'eicon-text-align-left' ],
                    'center' => [ 'title' => __( 'Center', 'pdf-poster' ), 'icon' => 'eicon-text-align-center' ],
                    'right'  => [ 'title' => __( 'Right', 'pdf-poster' ), 'icon' => 'eicon-text-align-right' ],
                ],
                'selectors' => [ $title => 'text-align: {{VALUE}};' ],
            ] );

            $this->add_control( 'title_color', [
                'label'     => __( 'Color', 'pdf-poster' ),
                'type'      => Controls_Manager::COLOR,
                'selectors' => [ $title => 'color: {{VALUE}};' ],
            ] );

            $this->add_group_control( Group_Control_Typography::get_type(), [
                'name'           => 'title_typography',
                'selector'       => $title,
                'fields_options' => [
                    'font_size' => [
                        'selectors' => [ '{{SELECTOR}}' => 'font-size: {{SIZE}}{{UNIT}} !important;' ],
                    ],
                ],
            ] );

            $this->add_responsive_control( 'title_margin', [
                'label'      => __( 'Margin', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', 'em' ],
                'selectors'  => [ $title => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}} !important;' ],
            ] );

            $this->end_controls_section();
        }

        private function register_button_style_controls() {
            $this->start_controls_section( 'style_buttons', [
                'label' => __( 'Download & Fullscreen Buttons', 'pdf-poster' ),
                'tab'   => Controls_Manager::TAB_STYLE,
            ] );

            $this->add_button_controls(
                'btn',
                self::WRAPPER . ' .cta_wrapper a, ' . self::WRAPPER . ' .cta_wrapper button',
                self::WRAPPER . ' .cta_wrapper a:hover, ' . self::WRAPPER . ' .cta_wrapper button:hover'
            );

            $this->end_controls_section();
        }

        private function register_popup_style_controls() {
            $this->start_controls_section( 'style_popup', [
                'label' => __( 'Popup Trigger', 'pdf-poster' ),
                'tab'   => Controls_Manager::TAB_STYLE,
            ] );

            $this->add_control( 'popup_style_note', [
                'type'            => Controls_Manager::RAW_HTML,
                'raw'             => esc_html__( 'Used when the PDF opens in a popup.', 'pdf-poster' ),
                'content_classes' => 'elementor-descriptor',
            ] );

            $this->add_control( 'popup_btn_heading', [
                'label' => __( 'Button', 'pdf-poster' ),
                'type'  => Controls_Manager::HEADING,
            ] );

            $this->add_button_controls(
                'popup_btn',
                self::WRAPPER . ' .popup-btn',
                self::WRAPPER . ' .popup-btn:hover'
            );

            $this->add_control( 'popup_align', [
                'label'     => __( 'Alignment', 'pdf-poster' ),
                'type'      => Controls_Manager::CHOOSE,
                'options'   => [
                    'flex-start' => [ 'title' => __( 'Left', 'pdf-poster' ), 'icon' => 'eicon-text-align-left' ],
                    'center'     => [ 'title' => __( 'Center', 'pdf-poster' ), 'icon' => 'eicon-text-align-center' ],
                    'flex-end'   => [ 'title' => __( 'Right', 'pdf-poster' ), 'icon' => 'eicon-text-align-right' ],
                ],
                'selectors' => [ self::WRAPPER . ' .popup-trigger' => 'justify-content: {{VALUE}};' ],
            ] );

            $img = self::WRAPPER . ' .popup-trigger img';

            $this->add_control( 'popup_img_heading', [
                'label'     => __( 'Image', 'pdf-poster' ),
                'type'      => Controls_Manager::HEADING,
                'separator' => 'before',
            ] );

            $this->add_control( 'popup_img_fit', [
                'label'     => __( 'Object Fit', 'pdf-poster' ),
                'type'      => Controls_Manager::SELECT,
                'options'   => [
                    ''        => __( 'Default', 'pdf-poster' ),
                    'cover'   => __( 'Cover', 'pdf-poster' ),
                    'contain' => __( 'Contain', 'pdf-poster' ),
                    'fill'    => __( 'Fill', 'pdf-poster' ),
                ],
                'selectors' => [ $img => 'object-fit: {{VALUE}};' ],
            ] );

            $this->add_group_control( Group_Control_Border::get_type(), [
                'name'     => 'popup_img_border',
                'selector' => $img,
            ] );

            // Elementor's own `.elementor img { border-radius: 0; box-shadow: none }` is
            // weaker than {{WRAPPER}} selectors, so these win without !important.
            $this->add_responsive_control( 'popup_img_radius', [
                'label'      => __( 'Border Radius', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%' ],
                'selectors'  => [ $img => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );

            $this->add_group_control( Group_Control_Box_Shadow::get_type(), [
                'name'     => 'popup_img_shadow',
                'selector' => $img,
            ] );

            $this->end_controls_section();
        }

        private function register_frame_style_controls() {
            $this->start_controls_section( 'style_frame', [
                'label' => __( 'Viewer Frame', 'pdf-poster' ),
                'tab'   => Controls_Manager::TAB_STYLE,
            ] );

            $frame = self::WRAPPER . ' ' . self::FRAME;

            $this->add_group_control( Group_Control_Border::get_type(), [
                'name'     => 'frame_border',
                'selector' => $frame,
            ] );

            $this->add_responsive_control( 'frame_radius', [
                'label'      => __( 'Border Radius', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%' ],
                'selectors'  => [ $frame => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}; overflow: hidden;' ],
            ] );

            $this->add_group_control( Group_Control_Box_Shadow::get_type(), [
                'name'     => 'frame_shadow',
                'selector' => $frame,
            ] );

            $this->end_controls_section();
        }

        /**
         * Normal/Hover colour tabs plus typography, padding and radius for a button.
         */
        private function add_button_controls( $prefix, $normal, $hover ) {
            $this->start_controls_tabs( $prefix . '_tabs' );

            foreach ( [ 'normal' => $normal, 'hover' => $hover ] as $state => $selector ) {
                $suffix = $state === 'hover' ? '_hover' : '';

                $this->start_controls_tab( $prefix . '_tab_' . $state, [
                    'label' => $state === 'hover' ? __( 'Hover', 'pdf-poster' ) : __( 'Normal', 'pdf-poster' ),
                ] );

                $this->add_control( $prefix . '_color' . $suffix, [
                    'label'     => __( 'Text Color', 'pdf-poster' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [ $selector => 'color: {{VALUE}};' ],
                ] );

                $this->add_control( $prefix . '_bg' . $suffix, [
                    'label'     => __( 'Background', 'pdf-poster' ),
                    'type'      => Controls_Manager::COLOR,
                    'selectors' => [ $selector => 'background: {{VALUE}};' ],
                ] );

                // Normal state's border colour lives in the Border group below.
                if ( $state === 'hover' ) {
                    $this->add_control( $prefix . '_border_color_hover', [
                        'label'     => __( 'Border Color', 'pdf-poster' ),
                        'type'      => Controls_Manager::COLOR,
                        'selectors' => [ $selector => 'border-color: {{VALUE}};' ],
                        'condition' => [ $prefix . '_border_border!' => '' ],
                    ] );
                }

                $this->end_controls_tab();
            }

            $this->end_controls_tabs();

            $this->add_group_control( Group_Control_Typography::get_type(), [
                'name'      => $prefix . '_typography',
                'selector'  => $normal,
                'separator' => 'before',
            ] );

            $this->add_group_control( Group_Control_Border::get_type(), [
                'name'     => $prefix . '_border',
                'selector' => $normal,
            ] );

            $this->add_responsive_control( $prefix . '_radius', [
                'label'      => __( 'Border Radius', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%' ],
                'selectors'  => [ $normal => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );

            $this->add_responsive_control( $prefix . '_padding', [
                'label'      => __( 'Padding', 'pdf-poster' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', 'em' ],
                'selectors'  => [ $normal => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );
        }

        /**
         * id => label options for the poster picker. Only built where the panel shows them
         * (the editor is an admin request); on the live page the saved id is all that's
         * needed, so the query is skipped.
         */
        private function poster_options() {
            static $cache = null;

            if ( ! is_admin() ) {
                return [];
            }
            if ( $cache !== null ) {
                return $cache;
            }

            $statuses = get_post_stati( [ 'show_in_admin_all_list' => true ], 'objects' );
            $posters  = get_posts( [
                'post_type'              => 'pdfposter',
                'post_status'            => array_keys( $statuses ),
                'posts_per_page'         => self::MAX_LISTED_POSTERS,
                'orderby'                => 'title',
                'order'                  => 'ASC',
                'suppress_filters'       => false,
                'no_found_rows'          => true,
                'update_post_meta_cache' => false,
                'update_post_term_cache' => false,
            ] );

            $options = [];
            foreach ( $posters as $poster ) {
                $title = $poster->post_title !== '' ? $poster->post_title : __( '(no title)', 'pdf-poster' );
                /* translators: 1: poster title, 2: poster ID */
                $label = sprintf( __( '%1$s (#%2$d)', 'pdf-poster' ), $title, $poster->ID );
                if ( $poster->post_status !== 'publish' && isset( $statuses[ $poster->post_status ] ) ) {
                    $label .= ' — ' . $statuses[ $poster->post_status ]->label;
                }
                $options[ (string) $poster->ID ] = $label;
            }

            return $cache = $options;
        }

        /* ------------------------------------------------------------------------------ *
         * Render
         * ------------------------------------------------------------------------------ */

        protected function render() {
            $settings = $this->get_settings_for_display();
            $source   = isset( $settings['source'] ) ? $settings['source'] : 'poster';

            if ( $source === 'shortcode' ) {
                $output = $this->render_shortcode( $settings );
            } else {
                $block = $source === 'file' ? $this->file_block( $settings ) : $this->poster_block( $settings );
                if ( ! $block ) {
                    return;
                }

                $block['attrs'] = $this->apply_overrides( $block['attrs'], $settings );

                // Once, the same way every other entry point asks for them.
                PDFP_EnqueueAssets::enqueue_viewer_assets();

                $output = render_block( $block );
            }

            if ( $output === null ) {
                return;
            }

            if ( trim( (string) $output ) === '' ) {
                $this->editor_notice( __( 'Nothing to show. Check that the PDF exists and is published.', 'pdf-poster' ) );
                return;
            }

            // The poster block's own renderer escapes its output.
            echo '<div class="pdfp-elementor-widget">' . $output . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        }

        /**
         * The block a saved poster renders, resolved exactly as [pdf id=".."] does.
         */
        private function poster_block( array $settings ) {
            $id = absint( isset( $settings['poster_id'] ) ? $settings['poster_id'] : 0 );
            if ( ! $id ) {
                $this->editor_notice( __( 'Select a PDF Poster in the widget settings.', 'pdf-poster' ) );
                return null;
            }

            $post = get_post( $id );
            if ( ! $post || $post->post_type !== 'pdfposter' || $post->post_status === 'trash' ) {
                $this->editor_notice( __( 'This PDF Poster no longer exists or is in the trash. Pick another one.', 'pdf-poster' ) );
                return null;
            }

            $shortcodes = new PDFP_Shortcodes();
            return $shortcodes->resolve_block( $id, $post );
        }

        /**
         * A block built from the widget's own PDF File settings.
         *
         * The settings are laid out as the metabox's `_fpdf` fields and run through
         * Utils::pdfp_block_from_meta() -- the converter every classic-editor poster goes
         * through -- so the widget gets the same attributes and defaults a saved poster
         * would, with no second mapping to keep in step.
         */
        private function file_block( array $settings ) {
            $url     = isset( $settings['file_url']['url'] ) ? trim( (string) $settings['file_url']['url'] ) : '';
            $file_id = 0;

            if ( $url === '' && ! empty( $settings['file_media']['url'] ) ) {
                $url     = (string) $settings['file_media']['url'];
                $file_id = absint( isset( $settings['file_media']['id'] ) ? $settings['file_media']['id'] : 0 );
            }

            $url = esc_url_raw( $url );
            if ( $url === '' && ! $this->uses_image_pages( $settings ) ) {
                $this->editor_notice( __( 'Choose a PDF from the media library or paste its URL.', 'pdf-poster' ) );
                return null;
            }

            // get_settings_for_display() returns null for every control whose panel
            // condition is not met (Flip Sound outside FlipBook, the share toggles while
            // sharing is off, ...). The metabox keeps such values, and so must this, or
            // the same poster settings would map differently in the two editors. Fill the
            // gaps from the stored settings; display values (dynamic tags resolved) win.
            foreach ( $this->get_settings() as $key => $value ) {
                if ( ! isset( $settings[ $key ] ) ) {
                    $settings[ $key ] = $value;
                }
            }

            $meta = $this->file_meta( $settings, $url, $file_id );

            // Same reader semantics as pdfp__get_post_meta(): a switcher is on when it is '1'.
            $read = function ( $key, $default = null, $is_boolean = false ) use ( $meta ) {
                if ( isset( $meta[ $key ] ) ) {
                    return $is_boolean ? $meta[ $key ] === '1' : $meta[ $key ];
                }
                return $default;
            };

            $title = sanitize_text_field( isset( $settings['title'] ) ? $settings['title'] : '' );

            return Utils::pdfp_block_from_meta( $read, 0, $title );
        }

        private function uses_image_pages( array $settings ) {
            return isset( $settings['viewer'], $settings['flipbook_source_type'] )
                && in_array( $settings['viewer'], [ 'flipbook', 'slider' ], true )
                && $settings['flipbook_source_type'] === 'images'
                && ! empty( $settings['flipbook_images'] );
        }

        /**
         * Widget settings -> the metabox's `_fpdf` field set, in the shapes CSF stores:
         * switchers '1'/'', dimensions as arrays, uploads as ['url' => ...].
         *
         * Only the fields this build's metabox has. Keys left out fall back to the
         * converter's defaults, exactly as on a classic poster that never stored them.
         */
        private function file_meta( array $s, $url, $file_id ) {
            $flag = function ( $key ) use ( $s ) {
                return isset( $s[ $key ] ) && $s[ $key ] === 'yes' ? '1' : '';
            };
            $pick = function ( $key, array $allowed, $default ) use ( $s ) {
                return isset( $s[ $key ] ) && in_array( $s[ $key ], $allowed, true ) ? $s[ $key ] : $default;
            };
            $text = function ( $key, $default = '' ) use ( $s ) {
                return isset( $s[ $key ] ) && $s[ $key ] !== '' ? sanitize_text_field( $s[ $key ] ) : $default;
            };

            $meta = [
                // General
                'viewer'               => $pick( 'viewer', [ 'default', 'flipbook', 'slider' ], 'default' ),
                'source'               => $url,
                'source_id'            => $file_id,
                'flipbook_source_type' => $this->uses_image_pages( $s ) ? 'images' : 'pdf',
                'flipbook_images'      => implode( ',', array_filter( array_map( function ( $image ) {
                    return isset( $image['id'] ) ? (int) $image['id'] : 0;
                }, isset( $s['flipbook_images'] ) ? (array) $s['flipbook_images'] : [] ) ) ),
                // The block's own default size, so a widget with nothing set in Size keeps
                // the look it has always had (the metabox's 1122px is taller). The Size
                // controls are applied afterwards by apply_overrides().
                'height'               => [ 'height' => 840, 'unit' => 'px' ],
                'height_tablet'        => [ 'height' => 700, 'unit' => 'px' ],
                'height_mobile'        => [ 'height' => 500, 'unit' => 'px' ],
                'width'                => [ 'width' => 100, 'unit' => '%' ],
                'width_tablet'         => [ 'width' => 100, 'unit' => '%' ],
                'width_mobile'         => [ 'width' => 100, 'unit' => '%' ],
                // Controls
                'show_filename'         => $flag( 'show_name' ),
                'keyboard_nav'          => $flag( 'keyboard_nav' ),
                'rtl_mode'              => $pick( 'rtl_mode', [ 'off', 'on', 'auto' ], 'off' ),
                'theme_mode'            => $pick( 'theme_mode', [ 'light', 'dark', 'auto' ], 'light' ),
                'flipbook_sound'        => $flag( 'flipbook_sound' ),
                'annotation_mode'       => $flag( 'annotation_mode' ),
                'open_links_in_new_tab' => $flag( 'open_links_in_new_tab' ),
                // Actions
                'print'               => $flag( 'print' ),
                'show_download_btn'   => $flag( 'download_button' ),
                'view_fullscreen_btn' => $flag( 'fullscreen_button' ),
                'fullscreen_btn_text' => $text( 'fullscreen_text', 'View Fullscreen' ),
                // Popup
                'popup'                   => $flag( 'popup' ),
                'popup_btn_text'          => $text( 'popup_text', 'Open PDF' ),
                'popup_trigger_type'      => $pick( 'popup_trigger_type', [ 'button', 'image' ], 'button' ),
                'popup_image'             => [ 'url' => esc_url_raw( isset( $s['popup_image']['url'] ) ? (string) $s['popup_image']['url'] : '' ) ],
                'popup_image_pdf_icon'    => $flag( 'popup_image_pdf_icon' ),
                'popup_trigger_alignment' => [ 'flex-start' => 'left', 'center' => 'center', 'flex-end' => 'right' ][ $pick( 'popup_align', [ 'flex-start', 'center', 'flex-end' ], 'center' ) ],
                // Watermark
                'watermark_enable' => $flag( 'watermark_enable' ),
                'watermark_theme'  => $pick( 'watermark_theme', Utils::pdfp_watermark_free_themes(), 'confidential' ),
                'watermark_text'   => $text( 'watermark_text', 'CONFIDENTIAL' ),
                'watermark_apply'  => array_values( array_intersect( isset( $s['watermark_apply'] ) ? (array) $s['watermark_apply'] : [ 'screen' ], [ 'screen', 'print', 'download' ] ) ),
                'watermark_pages'  => $pick( 'watermark_pages', [ 'all', 'first', 'except-first' ], 'all' ),
                // Social Share
                'social_share'           => $flag( 'social_share' ),
                'social_share_position'  => $pick( 'social_share_position', [ 'top', 'bottom' ], 'top' ),
                'social_share_facebook'  => $flag( 'social_share_facebook' ),
                'social_share_twitter'   => $flag( 'social_share_twitter' ),
                'social_share_linkedin'  => $flag( 'social_share_linkedin' ),
                'social_share_pinterest' => $flag( 'social_share_pinterest' ),
                'social_share_mailto'    => $flag( 'social_share_mailto' ),
                // Advanced
                'custom_class' => implode( ' ', array_filter( array_map( 'sanitize_html_class', preg_split( '/\s+/', isset( $s['custom_class'] ) ? (string) $s['custom_class'] : '' ) ) ) ),
                'custom_css'   => isset( $s['custom_css'] ) ? (string) $s['custom_css'] : '', // render.php strips tags before printing
                // Performance & Reliability
                'progressive_loading' => $flag( 'progressive_loading' ),
                'default_browser'     => $flag( 'default_browser' ),
            ];

            // Cover (Auto Thumbnail). render.php resolves 'default' against the site setting.
            $meta['cover_first']    = $pick( 'cover_first', [ 'default', 'on', 'off' ], 'default' );
            $meta['cover_btn_text'] = $text( 'cover_btn_text' );

            // Popup image size: desktop into the block so the markup is right before
            // Elementor's stylesheet applies; tablet/mobile come from the selectors.
            foreach ( [ 'popup_image_width' => 'width', 'popup_image_height' => 'height' ] as $key => $dim ) {
                $v = isset( $s[ $key ] ) ? $s[ $key ] : null;
                if ( $this->size_value( $v ) !== '' ) {
                    $meta[ $key ] = [ $dim => 0 + $v['size'], 'unit' => $v['unit'] ];
                }
            }

            return $meta;
        }

        /**
         * Size, alignment and editor-only tweaks, applied on top of either source.
         */
        private function apply_overrides( array $attrs, array $settings ) {
            foreach ( [ 'width', 'height' ] as $key ) {
                $value = $this->responsive_size(
                    isset( $attrs[ $key ] ) ? $attrs[ $key ] : null,
                    $this->block_default( $key, [] ),
                    $settings,
                    $key
                );
                if ( $value !== null ) {
                    $attrs[ $key ] = $value;
                }
            }

            if ( ! empty( $settings['alignment'] ) && in_array( $settings['alignment'], [ 'left', 'center', 'right' ], true ) ) {
                $attrs['alignment'] = $settings['alignment'];
            }

            // An editor re-rendering the widget is not a reader. pdfp_should_count() skips
            // editors only while that setting is on; this covers it being off.
            if ( $this->is_editor_preview() ) {
                $attrs['trackingEnabled'] = false;
            }

            return $attrs;
        }

        /**
         * The block's {desktop, tablet, mobile} size with the widget's responsive values
         * laid over it, or null when the widget sets nothing (the poster's size stands).
         *
         * A device left empty in the widget inherits the next larger device's widget
         * value, as Elementor's own responsive controls do.
         */
        private function responsive_size( $current, $default, array $settings, $key ) {
            $desktop = $this->size_value( isset( $settings[ $key ] ) ? $settings[ $key ] : null );
            $tablet  = $this->size_value( isset( $settings[ $key . '_tablet' ] ) ? $settings[ $key . '_tablet' ] : null );
            $mobile  = $this->size_value( isset( $settings[ $key . '_mobile' ] ) ? $settings[ $key . '_mobile' ] : null );

            if ( $desktop === '' && $tablet === '' && $mobile === '' ) {
                return null;
            }

            if ( is_array( $current ) ) {
                $base = array_merge( (array) $default, $current );
            } elseif ( is_string( $current ) && $current !== '' ) {
                $base = [ 'desktop' => $current, 'tablet' => $current, 'mobile' => $current ];
            } else {
                $base = (array) $default;
            }

            $out            = $base;
            $out['desktop'] = $desktop !== '' ? $desktop : ( isset( $base['desktop'] ) ? $base['desktop'] : '' );
            $out['tablet']  = $tablet !== '' ? $tablet : ( $desktop !== '' ? $desktop : ( isset( $base['tablet'] ) ? $base['tablet'] : $out['desktop'] ) );
            $out['mobile']  = $mobile !== '' ? $mobile : ( $tablet !== '' ? $tablet : ( $desktop !== '' ? $desktop : ( isset( $base['mobile'] ) ? $base['mobile'] : $out['tablet'] ) ) );

            return $out;
        }

        /**
         * '600px' from an Elementor slider value, or '' when unset.
         */
        private function size_value( $value ) {
            if ( ! is_array( $value ) || ! isset( $value['size'] ) || $value['size'] === '' || $value['size'] === null ) {
                return '';
            }

            $unit = isset( $value['unit'] ) && in_array( $value['unit'], [ 'px', '%', 'vw', 'vh', 'em', 'rem' ], true ) ? $value['unit'] : 'px';

            return ( 0 + $value['size'] ) . $unit;
        }

        /**
         * Runs the first PDF Poster shortcode in the field, and nothing else.
         *
         * @return string|null Output, or null after printing an editor notice.
         */
        private function render_shortcode( array $settings ) {
            $text = trim( (string) ( isset( $settings['shortcode'] ) ? $settings['shortcode'] : '' ) );
            if ( $text === '' ) {
                $this->editor_notice( __( 'Paste a PDF Poster shortcode in the widget settings.', 'pdf-poster' ) );
                return null;
            }

            if ( ! preg_match( '/' . get_shortcode_regex( self::SHORTCODES ) . '/', $text, $m ) || ( $m[1] === '[' && $m[6] === ']' ) ) {
                $this->editor_notice( __( 'That is not a PDF Poster shortcode. Use [pdf id="…"] or [pdf_embed url="…"].', 'pdf-poster' ) );
                return null;
            }

            return do_shortcode( $m[0] );
        }

        private function block_default( $attribute, $fallback ) {
            $type = \WP_Block_Type_Registry::get_instance()->get_registered( 'pdfp/pdfposter' );
            if ( $type && isset( $type->attributes[ $attribute ]['default'] ) ) {
                return $type->attributes[ $attribute ]['default'];
            }
            return $fallback;
        }

        private function on( array $settings, $key ) {
            return isset( $settings[ $key ] ) && $settings[ $key ] === 'yes';
        }

        private function editor_notice( $message ) {
            if ( ! $this->is_editor_preview() ) {
                return;
            }
            printf(
                '<div class="pdfp-elementor-notice" style="padding:24px;border:1px dashed #c3c4c7;border-radius:4px;background:#f6f7f7;color:#50575e;text-align:center;font-size:14px;line-height:1.5;">%s</div>',
                esc_html( $message )
            );
        }

        private function is_editor_preview() {
            if ( ! class_exists( '\Elementor\Plugin' ) ) {
                return false;
            }
            $elementor = \Elementor\Plugin::$instance;
            return ( $elementor->editor && $elementor->editor->is_edit_mode() )
                || ( $elementor->preview && $elementor->preview->is_preview_mode() );
        }
    }
}
