<?php

namespace PDFPro\Base;

use PDFPro\Helper\PDFP_Functions as Utils;

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'PDFPro\Base\PDFP_EnqueueAssets' ) ) {
    class PDFP_EnqueueAssets {

    public function register() {
        add_action("wp_enqueue_scripts", [$this, 'publicAssets']);
        add_action('admin_enqueue_scripts', [$this, 'adminAssets']);
        add_action('elementor/frontend/after_enqueue_scripts', [$this, 'publicAssets']);
        add_action('elementor/preview/enqueue_scripts', [$this, 'publicAssets']);
        // Media button
        add_action('wp_enqueue_media', [$this, 'pdfp_media_button_js_file']);
        add_action('script_loader_tag', [$this, 'script_loader_tag'], 10, 3);
        add_action('init', [$this, 'init']);
        add_action('enqueue_block_assets', [$this, 'blockAssets']);
    }

    /**
     * inti action
     */
    public function init() {
        // dFlip powers the FlipBook and Slider viewers. Registered only when the engine
        // is actually on disk so a stripped package degrades instead of 404ing.
        if (file_exists(PDFPRO_PATH . 'assets/dflip/js/dflip.min.js')) {
            wp_register_script('dflip-script', PDFPRO_PLUGIN_DIR . 'assets/dflip/js/dflip.min.js', array('jquery'), PDFPRO_VER, true);
            wp_add_inline_script('dflip-script', 'window.dFlipLocation = "' . PDFPRO_PLUGIN_DIR . 'assets/dflip/";', 'before');
            wp_register_style('dflip-style', PDFPRO_PLUGIN_DIR . 'assets/dflip/css/dflip.min.css', array(), PDFPRO_VER);
        }

        self::register_public_assets();
    }

    /**
     * Register (never enqueue) the viewer handles.
     *
     * This has to happen on `init`, not on `wp_enqueue_scripts`. Page builders render a
     * single element through admin-ajax, where `wp_enqueue_scripts` never fires --
     * WPBakery's Vc_Frontend_Editor::renderShortcodes() calls enqueueRequired(true),
     * which skips that action outright. Registering there meant every enqueue call the
     * shortcode makes during such a render was a silent no-op: the markup arrived, the
     * viewer script and the `pdfp` global never did, and the block sat on its
     * "Loading Viewer..." placeholder forever.
     *
     * `init` runs for every request type -- front end, admin, admin-ajax, REST -- so one
     * registration point covers all of them. Registering is cheap and prints nothing;
     * only the enqueue calls decide what ships.
     */
    public static function register_public_assets() {
        if (wp_script_is('pdfp-public', 'registered')) {
            return;
        }

        wp_register_style('pdfp-public',  PDFPRO_PLUGIN_DIR . 'build/public.css', array(), PDFPRO_VER);
        wp_register_script('pdfp-public', PDFPRO_PLUGIN_DIR . 'build/public.js', array('jquery'), PDFPRO_VER, true);
        wp_register_script('pdfp-pdfposter-view-script', PDFPRO_PLUGIN_DIR . 'build/blocks/pdf-poster/view.js', array('react', 'react-dom', 'jquery'), PDFPRO_VER, true);

        // Premium assets removed

        $localize_data = [
            'dir' => PDFPRO_PLUGIN_DIR,
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'isPipe' => false,
            'is_rtl' => is_rtl(),
            // Capability, not entitlement: tells the JS whether the flipbook engine
            // exists in this build so it can fall back instead of rendering an empty box.
            'hasFlipbookEngine' => Utils::pdfp_has_flipbook_engine(),
            // Whether the visitor may edit posts. Only used to decide how much detail a
            // load failure is allowed to show -- a visitor gets "this document could not
            // be loaded", an editor gets the URL that 404'd.
            'canEdit' => current_user_can('edit_posts'),
            // Document Insights. The endpoint is public and the flag is a plain bool:
            // both are safe in cached HTML, which is the point -- nothing here is a
            // nonce that could expire inside a cached page.
            'trackUrl' => rest_url('pdfp/v1/track'),
            'track' => Utils::pdfp_tracking_enabled(),
        ];

        if (Utils::pdfp_has_flipbook_engine()) {
            $localize_data['dflipAssetsUrl'] = PDFPRO_PLUGIN_DIR . 'assets/dflip/';
        }

        // Premium data localization removed

        wp_localize_script('pdfp-public', 'pdfp', $localize_data);
        wp_localize_script('pdfp-pdfposter-view-script', 'pdfp', $localize_data);
    }

    /**
     * Enqueue everything the front-end viewer needs.
     *
     * The single entry point for shortcodes, blocks and builder integrations, so no
     * caller has to know the handle names or the registration order.
     */
    public static function enqueue_viewer_assets() {
        // A builder rendering through admin-ajax skipped `wp_enqueue_scripts`, and an
        // integration can run before `init` in an unusual boot order. Registration is
        // idempotent, so ask for it rather than assume it happened.
        self::register_public_assets();

        wp_enqueue_style('pdfp-public');
        wp_enqueue_script('pdfp-public');
        wp_enqueue_script('pdfp-pdfposter-view-script');
    }

    /**
     * Enqueue public assets
     */
    public function publicAssets() {
        self::register_public_assets();

        // The stylesheet is unconditional: it also covers markup printed by themes and
        // builders that never reach a shortcode callback.
        wp_enqueue_style('pdfp-public');

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $is_elementor_preview = isset($_GET['elementor-preview']) || (isset($_REQUEST['action']) && $_REQUEST['action'] === 'elementor_ajax') || did_action('elementor/frontend/after_enqueue_scripts') || did_action('elementor/preview/enqueue_scripts');

        if ($is_elementor_preview) {
            // Premium elementor script removed
            self::enqueue_viewer_assets();
        }
    }

    public function script_loader_tag($tag, $handle, $src) {
        // Premium script loader tag removed
        return $tag;
    }

    /**
     * enqueue admin assets
     **/
    function adminAssets($hook) {
        $option = get_option('fpdf_option');
        $postType = get_post_type();
        if (in_array($hook, ['admin_page_pdf-poster-pricing-manual', 'pdfposter_page_fpdf-support', 'pdfposter_page_fpdf-settings', 'post.php', 'post-new.php']) || $postType === 'pdfposter') {
            // Premium admin assets removed

            // The flipbook engine is gated on the asset being present so the editor
            // preview matches what the front end can actually render.
            if (Utils::pdfp_has_flipbook_engine()) {
                wp_enqueue_script('dflip-script');
                wp_enqueue_style('dflip-style');
            }
        }
        wp_enqueue_script('pdfp-admin', PDFPRO_PLUGIN_DIR . 'build/admin.js', array('jquery'), PDFPRO_VER, true);
        wp_enqueue_style('pdfp-admin', PDFPRO_PLUGIN_DIR . 'build/admin.css', array(), PDFPRO_VER);

        $current_screen = get_current_screen();
        if ('settings_page_pdf_poster_settings' == $hook) {
            $cm_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'text/css'));
            wp_localize_script('jquery', 'cm_settings', $cm_settings);
            wp_enqueue_script('wp-theme-plugin-editor');
            wp_enqueue_style('wp-codemirror');
            wp_enqueue_script('pdfp-codemirror', PDFPRO_PLUGIN_DIR . 'assets/admin/js/codemirror-init.js', array('jquery'), PDFPRO_VER, true);
        }

        $fpdfAdmin = array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'isPipe' => false,
            'hasFlipbookEngine' => Utils::pdfp_has_flipbook_engine()
        );

        // Which mark types each watermark theme can draw, so the metabox offers the
        // same themes the block sidebar does (see src/admin.js).
        $fpdfAdmin['watermarkThemeTypes'] = wp_list_pluck(Utils::pdfp_watermark_themes(), 'types');

        // The themes this build may render. src/admin.js hides the rest, because
        // pdfp_watermark_resolve() would refuse to draw them anyway.
        $fpdfAdmin['watermarkFreeThemes'] = array_values(Utils::pdfp_watermark_free_themes());

        wp_localize_script('pdfp-admin', 'fpdfAdmin', $fpdfAdmin);
    }

    public function blockAssets() {
        if (is_admin() && Utils::pdfp_has_flipbook_engine()) {
            wp_enqueue_style('dflip-style');
        }
    }

    public function pdfp_media_button_js_file() {
        wp_enqueue_script('pdfp-direct', PDFPRO_PLUGIN_DIR . 'assets/admin/js/pdf_button.js', array('jquery'), PDFPRO_VER, true);
    }
}
}
