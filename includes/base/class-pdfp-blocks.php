<?php

namespace PDFPro\Base;

if (!defined('ABSPATH')) {
  return;
}

use PDFPro\Helper\PDFP_Functions as Utils;


if (!class_exists('PDFPro\Base\PDFP_RegisterBlock')) {
  class PDFP_RegisterBlock {
    protected static $_instance = null;

    public function __construct() {
      add_action('init', [$this, 'enqueue_script']);
    }

    /**
     * Create Instance
     */
    public static function instance()
    {
      if (self::$_instance === null) {
        self::$_instance = new self();
      }
      return self::$_instance;
    }

    public function enqueue_script() {
      // wp_register_script(	'pdfp-editor', PDFPRO_PLUGIN_DIR.'build/editor.js', array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'jquery'  ), PDFPRO_VER, true );

      wp_register_style('pdfp-editor', PDFPRO_PLUGIN_DIR . 'build/editor.css', array(), PDFPRO_VER);

      register_block_type(PDFPRO_PATH . 'build/blocks/pdf-poster');

      register_block_type(PDFPRO_PATH . 'build/blocks/selector');

      $option = get_option('fpdf_option', []);

      $pdfp_data = [
        'siteUrl' => home_url(),
        'pipe' => false,
        'placeholder' => PDFPRO_PLUGIN_DIR . 'assets/images/placeholder.pdf',
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('wp_ajax'),
        'dir' => PDFPRO_PLUGIN_DIR,
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'isPipe' => false
      ];

      wp_localize_script('pdfp-pdfposter-editor-script', 'pdfp', $pdfp_data);
      wp_localize_script('meta-box-document-embedder-editor-script', 'pdfp', $pdfp_data);

      // Handles are the ones register_block_type() derives from each block.json
      // `name` -- 'pdfp-editor' was never registered (see the commented-out
      // wp_register_script above), so the old call here translated nothing.
      // Passing the plugin's own languages dir keeps bundled .json working; WP
      // falls back to WP_LANG_DIR/plugins for translate.wordpress.org files.
      wp_set_script_translations('pdfp-pdfposter-editor-script', 'pdf-poster', PDFPRO_PATH . 'languages');
      wp_set_script_translations('meta-box-document-embedder-editor-script', 'pdf-poster', PDFPRO_PATH . 'languages');
    }
  }

}
