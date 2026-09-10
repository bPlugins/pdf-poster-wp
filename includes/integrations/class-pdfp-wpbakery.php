<?php
/**
 * WPBakery Page Builder (js_composer) integration.
 *
 * Two separate problems, both invisible until you look at how WPBakery renders.
 *
 * 1. ASSETS. The frontend editor draws each element through the `vc_load_shortcode`
 *    admin-ajax call, and since js_composer 7.7 that path calls
 *    Vc_Frontend_Editor::enqueueRequired(true), which deliberately skips
 *    `do_action('wp_enqueue_scripts')`. Any plugin that REGISTERS its handles on
 *    `wp_enqueue_scripts` therefore has nothing registered during that request, every
 *    wp_enqueue_script() call in its shortcode is a silent no-op, and the element ships
 *    markup with no JavaScript behind it -- for this plugin, a permanent
 *    "Loading Viewer..." placeholder. The registration itself now lives on `init`
 *    (see PDFP_EnqueueAssets::register_public_assets), which fixes the general case;
 *    this class makes the editor case explicit rather than incidental.
 *
 * 2. DISCOVERABILITY. Without vc_map() there is no PDF Poster element in the builder at
 *    all -- the only way in is to remember the shortcode and type it into a Text Block.
 *
 * @package PDFPro
 */

namespace PDFPro\Integrations;

use PDFPro\Base\PDFP_EnqueueAssets;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'PDFPro\Integrations\PDFP_WPBakery' ) ) {
    class PDFP_WPBakery {

        /**
         * How many posters the element's dropdown offers.
         *
         * The list is built with a real query, so it is bounded. A site with more
         * posters than this can still use the shortcode, which takes any id.
         */
        const MAX_LISTED_POSTERS = 300;

        public function register() {
            // js_composer defines this the moment it loads; nothing below is worth
            // hooking on a site that does not have it.
            if ( ! defined( 'WPB_VC_VERSION' ) ) {
                return;
            }

            add_action( 'vc_before_init', [ $this, 'map_elements' ] );
            add_action( 'vc_load_shortcode', [ $this, 'enqueue_editor_assets' ] );
            add_action( 'vc_load_iframe_jscss', [ $this, 'enqueue_editor_assets' ] );
        }

        /**
         * Make sure the viewer's JS and CSS reach the frontend editor.
         *
         * Hooked to both of WPBakery's editor asset points: `vc_load_iframe_jscss` for
         * the initial editable page, and `vc_load_shortcode` for every element rendered
         * over ajax afterwards. The second is the one that matters -- it fires inside
         * loadShortcodes(), before the print_head_scripts()/wp_footer() block whose
         * output WPBakery injects into the editor document, so anything queued here
         * travels with the element that needs it.
         *
         * Unconditional inside the editor on purpose: the user may add a poster to the
         * page a moment from now, and the alternative is scanning shortcode strings for
         * tags a Text Block could also be hiding.
         */
        public function enqueue_editor_assets() {
            PDFP_EnqueueAssets::enqueue_viewer_assets();
        }

        /**
         * Register the builder elements.
         *
         * Both map onto shortcodes that already exist, so there is no second render
         * path to keep in step: WPBakery builds `[pdf id="12"]` or `[pdf_embed url=".."]`
         * and PDFP_Shortcodes renders it exactly as it would anywhere else.
         */
        public function map_elements() {
            if ( ! function_exists( 'vc_map' ) ) {
                return;
            }

            // vc_before_init runs on `init` for every request, including plain front-end
            // page views where the mapping is never read. Building the poster list there
            // would put an unnecessary query on every uncached page load.
            if ( ! $this->is_editing_context() ) {
                return;
            }

            $category = __( 'Content', 'pdf-poster' );
            $icon     = PDFPRO_PLUGIN_DIR . 'assets/images/icn.png';

            vc_map( [
                'name'        => __( 'PDF Poster', 'pdf-poster' ),
                'base'        => 'pdf',
                'icon'        => $icon,
                'category'    => $category,
                'description' => __( 'Display a saved PDF Poster.', 'pdf-poster' ),
                'params'      => [
                    [
                        'type'        => 'dropdown',
                        'heading'     => __( 'PDF Poster', 'pdf-poster' ),
                        'param_name'  => 'id',
                        'value'       => $this->poster_options(),
                        'admin_label' => true,
                        'description' => __( 'Pick one of your saved PDF Posters. Create them under PDF Posters.', 'pdf-poster' ),
                    ],
                ],
            ] );

            vc_map( [
                'name'        => __( 'PDF Embed (by URL)', 'pdf-poster' ),
                'base'        => 'pdf_embed',
                'icon'        => $icon,
                'category'    => $category,
                'description' => __( 'Display a PDF straight from a file URL.', 'pdf-poster' ),
                'params'      => [
                    [
                        'type'        => 'attach_file',
                        'heading'     => __( 'PDF File', 'pdf-poster' ),
                        'param_name'  => 'url',
                        'description' => __( 'Choose a PDF from the media library, or leave empty and paste a URL below.', 'pdf-poster' ),
                    ],
                    [
                        'type'        => 'textfield',
                        'heading'     => __( 'Title', 'pdf-poster' ),
                        'param_name'  => 'title',
                        'admin_label' => true,
                    ],
                    [
                        'type'       => 'textfield',
                        'heading'    => __( 'Width', 'pdf-poster' ),
                        'param_name' => 'width',
                        'value'      => '100%',
                    ],
                    [
                        'type'       => 'textfield',
                        'heading'    => __( 'Height', 'pdf-poster' ),
                        'param_name' => 'height',
                        'value'      => '842px',
                    ],
                    [
                        'type'       => 'checkbox',
                        'heading'    => __( 'Show download button', 'pdf-poster' ),
                        'param_name' => 'download_btn',
                        'value'      => [ __( 'Yes', 'pdf-poster' ) => 'true' ],
                    ],
                    [
                        'type'       => 'checkbox',
                        'heading'    => __( 'Allow printing', 'pdf-poster' ),
                        'param_name' => 'print',
                        'value'      => [ __( 'Yes', 'pdf-poster' ) => 'true' ],
                    ],
                ],
            ] );
        }

        /**
         * Are we somewhere the element mapping will actually be read?
         */
        private function is_editing_context() {
            if ( is_admin() ) {
                return true;
            }

            return function_exists( 'vc_is_page_editable' ) && vc_is_page_editable();
        }

        /**
         * Saved posters, shaped for a WPBakery dropdown (label => value).
         */
        private function poster_options() {
            $options = [ __( '— Select a PDF Poster —', 'pdf-poster' ) => '' ];

            $posters = get_posts( [
                'post_type'              => 'pdfposter',
                'post_status'            => 'publish',
                'posts_per_page'         => self::MAX_LISTED_POSTERS,
                'orderby'                => 'title',
                'order'                  => 'ASC',
                'suppress_filters'       => false,
                'no_found_rows'          => true,
                'update_post_meta_cache' => false,
                'update_post_term_cache' => false,
            ] );

            foreach ( $posters as $poster ) {
                $title = $poster->post_title !== '' ? $poster->post_title : __( '(no title)', 'pdf-poster' );

                /* translators: 1: poster title, 2: poster ID */
                $options[ sprintf( __( '%1$s (#%2$d)', 'pdf-poster' ), $title, $poster->ID ) ] = (string) $poster->ID;
            }

            return $options;
        }
    }
}
