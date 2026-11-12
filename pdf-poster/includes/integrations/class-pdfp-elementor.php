<?php
/**
 * Elementor integration.
 * @package PDFPro
 */

namespace PDFPro\Integrations;

use PDFPro\Base\PDFP_EnqueueAssets;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'PDFPro\Integrations\PDFP_Elementor' ) ) {
    class PDFP_Elementor {

        const CATEGORY = 'pdf-poster';

        /** Widget-only CSS; Elementor enqueues it only on pages that use the widget. */
        const STYLE_HANDLE = 'pdfp-elementor';

        public function register() {
            // After PDFP_EnqueueAssets::init() (priority 10) has registered pdfp-public.
            add_action( 'init', [ $this, 'register_styles' ], 20 );
            add_action( 'elementor/elements/categories_registered', [ $this, 'register_category' ] );
            add_action( 'elementor/widgets/register', [ $this, 'register_widgets' ] );
            add_action( 'elementor/editor/after_enqueue_styles', [ $this, 'editor_styles' ] );
            add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'editor_scripts' ] );
            add_action( 'elementor/preview/enqueue_scripts', [ $this, 'preview_assets' ] );
            add_action( 'elementor/preview/enqueue_styles', [ $this, 'preview_assets' ] );
        }

        /**
         * Undo the parts of Elementor's global reset that change how the viewer looks.
         *
         * Elementor ships `.elementor iframe { border: none; ... }` at the same specificity
         * as public.css's `.pdfp_wrapper iframe`, and loads later, so inside Elementor the
         * PDF.js viewer lost the 10px dark bar under it that every other embed has. The
         * widget class adds the weight needed to win back exactly that rule.
         *
         * A source-less handle: nothing is fetched, the inline CSS is printed with it.
         */
        public function register_styles() {
            if ( ! did_action( 'elementor/loaded' ) ) {
                return;
            }

            $deps = [ 'pdfp-public' ];
            if ( wp_style_is( self::block_style_handle(), 'registered' ) ) {
                $deps[] = self::block_style_handle();
            }
            wp_register_style( self::STYLE_HANDLE, false, $deps, PDFPRO_VER );
            wp_add_inline_style(
                self::STYLE_HANDLE,
                '.pdfp-elementor-widget .pdfp_wrapper iframe{border-bottom:10px solid #2a2a2a}'
            );
        }

        /**
         * The block's own stylesheet (block.json "style" => build/blocks/pdf-poster/view.css).
         *
         * It holds most of the viewer's layout -- including `.pdfp_fullscreen_close
         * { display: none }` -- and WordPress only attaches it when a block renders during
         * the page request. The Elementor editor renders widgets over admin-ajax after the
         * preview has loaded, so without asking for it explicitly the preview had none of
         * it: the fullscreen close "×" showed above every viewer, among other things.
         */
        public static function block_style_handle() {
            return function_exists( 'generate_block_asset_handle' )
                ? generate_block_asset_handle( 'pdfp/pdfposter', 'style' )
                : 'pdfp-pdfposter-style';
        }

        public function register_category( $elements_manager ) {
            $elements_manager->add_category( self::CATEGORY, [
                'title' => __( 'PDF Poster', 'pdf-poster' ),
                'icon'  => 'eicon-document-file',
            ] );
        }

        public function register_widgets( $widgets_manager ) {
            require_once PDFPRO_PATH . 'includes/integrations/elementor/class-pdfp-elementor-widget.php';
            $widgets_manager->register( new Elementor\PDFP_Elementor_Widget() );
        }

        /**
         * Elementor widget icons are icon-font classes. This one paints the plugin's own
         * icon instead, sized in em so it scales in the panel and the navigator alike.
         */
        public function editor_styles() {
            wp_add_inline_style( 'elementor-editor', sprintf(
                '.pdfp-elementor-icon{display:inline-block;width:1em;height:1em;background:url(%s) center/contain no-repeat;vertical-align:middle}'
                . '.pdfp-elementor-icon::before{content:""}',
                esc_url( PDFPRO_PLUGIN_DIR . 'assets/images/icn.png' )
            ) . $this->pro_css() );
        }

        /**
         * The "PDF Poster Pro" card at the foot of the widget's General section. Colours
         * come from Elementor's own --e-a-* tokens where it has them, so the card looks
         * right in the panel's light and dark UI themes.
         *
         * Nothing in the free widget is locked: Pro settings are simply not registered
         * here, and this card is the one place that describes them.
         */
        private function pro_css() {
            $blue = '#146ef5';
            return '
.pdfp-el-pro{display:inline-block;padding:0 5px;border-radius:3px;background:' . $blue . ';color:#fff;font-size:9px;font-weight:700;line-height:15px;letter-spacing:.05em;vertical-align:middle;text-transform:uppercase}
.pdfp-el-procard{border:1px solid var(--e-a-border-color,#e6e8ea);border-top:3px solid ' . $blue . ';border-radius:4px;padding:14px;background:var(--e-a-bg-default,#fff);color:var(--e-a-color-txt,#515962)}
.pdfp-el-procard__head{display:flex;align-items:center;gap:6px;font-weight:600;font-size:13px;color:var(--e-a-color-txt-accent,#0c0d0e)}
.pdfp-el-procard__head .pdfp-el-pro{margin-inline-start:auto}
.pdfp-el-procard__intro{margin:6px 0 10px;font-size:12px;line-height:1.5}
.pdfp-el-procard dl{margin:0 0 12px}
.pdfp-el-procard dt{position:relative;padding-inline-start:16px;margin-top:9px;font-size:12px;font-weight:600;color:var(--e-a-color-txt-accent,#0c0d0e)}
.pdfp-el-procard dt::before{content:"";position:absolute;inset-inline-start:2px;top:5px;width:6px;height:6px;border-radius:50%;background:' . $blue . '}
.pdfp-el-procard dd{margin:2px 0 0;padding-inline-start:16px;font-size:12px;line-height:1.45}
a.pdfp-el-procard__btn{display:block;text-align:center;background:' . $blue . ';color:#fff;border-radius:3px;padding:8px 10px;font-weight:600;font-size:12px;text-decoration:none}
a.pdfp-el-procard__btn:hover{background:#0d5cd6;color:#fff}
.pdfp-el-procard__foot{margin-top:6px;text-align:center;font-size:11px;opacity:.8}';
        }

        /**
         * The widget's "Edit PDF Poster" button fires `pdfp:edit:poster` on the editor
         * channel; open the poster picked in the widget's `poster_id` setting.
         */
        public function editor_scripts() {
            wp_add_inline_script( 'elementor-editor', sprintf(
                '(function () {
                    var bind = function () {
                        elementor.channels.editor.on("pdfp:edit:poster", function (view) {
                            var settings = view.container ? view.container.settings : view.elementSettingsModel;
                            var id = settings && parseInt(settings.get("poster_id"), 10);
                            if (id) {
                                window.open(%s + id, "_blank");
                            }
                        });
                    };
                    if (window.elementor && elementor.channels) {
                        bind();
                    } else {
                        jQuery(window).on("elementor:init", bind);
                    }
                })();',
                wp_json_encode( admin_url( 'post.php?action=edit&post=' ) )
            ) );
        }

        /**
         * The editor draws each widget over admin-ajax and splices the HTML into the
         * preview iframe, so an enqueue made during that render never arrives. Everything
         * a poster might need is loaded into the preview up front instead -- including
         * dFlip, which on a live page is only enqueued by posters that use a flipbook.
         */
        public function preview_assets() {
            PDFP_EnqueueAssets::enqueue_viewer_assets();
            wp_enqueue_style( self::block_style_handle() );
            wp_enqueue_style( self::STYLE_HANDLE );

            if ( wp_script_is( 'dflip-script', 'registered' ) ) {
                wp_enqueue_script( 'dflip-script' );
                wp_enqueue_style( 'dflip-style' );
            }
        }
    }
}
