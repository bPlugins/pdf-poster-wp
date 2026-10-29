<?php

namespace PDFPro\Base;

use PDFPro\Helper\PDFP_Functions as Utils;
use PDFPro\Base\PDFP_EnqueueAssets as Assets;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'PDFPro\Base\PDFP_Shortcodes' ) ) {
    class PDFP_Shortcodes {

  public function register() {
    add_shortcode('pdf', [$this, 'pdf'], 10, 2);
    add_shortcode('raw_pdf', [$this, 'raw_pdf']);
    add_shortcode('pdf_embed', [$this, 'pdf_embed']);
  }

  public function pdf($atts, $content) {
    extract(shortcode_atts(array(
      'id' => null,
    ), $atts));

    if (empty($id)) {
      return current_user_can('manage_options') ? '<p style="color:red">PDF Poster: Please provide a valid ID in shortcode.</p>' : '';
    }

    $id = absint($id);
    $post_type = get_post_type($id);
    $post = get_post($id);

    if ($post_type !== 'pdfposter' || !$post) {
      return current_user_can('manage_options') ? '<p style="color:red">PDF Poster: Invalid PDF Poster ID.</p>' : '';
    }

    // One call, because the handles have to be asked for the same way everywhere: a
    // page builder rendering this shortcode over admin-ajax never ran
    // `wp_enqueue_scripts`, so the helper (re)registers before enqueuing.
    Assets::enqueue_viewer_assets();

    return render_block($this->resolve_block($id, $post));
  }

  /**
   * Resolve the block to render for a saved poster.
   *
   * Only the post content proves a pdfp/pdfposter block was ever saved. The
   * isGutenberg meta is written to every auto-draft and never cleared, so a
   * metabox-configured poster can carry it with empty content -- branching on
   * it made the shortcode render nothing at all.
   */
  private function resolve_block($id, $post) {
    $blocks = parse_blocks($post->post_content ?? '');

    foreach ($blocks as $block) {
      if (isset($block['blockName']) && $block['blockName'] === 'pdfp/pdfposter') {
        // Document Insights needs to know which saved poster this is, and a block stored
        // in post_content has no idea -- it only knows its file. Stamping the id here is
        // what lets the counts land on `p:<id>`, which is the key the PDF Posters
        // columns and the editor's Analytics box both read.
        $block['attrs']['posterId'] = (int) $id;
        return $block;
      }
    }

    return Utils::generate_pdf_poster_block($id);
  }

  // Raw PDF ShortCode
  public function raw_pdf($atts) {
    extract(shortcode_atts(array(
      'id' => null,
    ), $atts));

    if (empty($id)) {
      return current_user_can('manage_options') ? '<p style="color:red">PDF Poster: Please provide a valid ID in shortcode.</p>' : '';
    }

    $id = absint($id);
    $post_type = get_post_type($id);
    $post = get_post($id);

    if ($post_type !== 'pdfposter' || !$post) {
      return current_user_can('manage_options') ? '<p style="color:red">PDF Poster: Invalid PDF Poster ID.</p>' : '';
    }

    // One call, because the handles have to be asked for the same way everywhere: a
    // page builder rendering this shortcode over admin-ajax never ran
    // `wp_enqueue_scripts`, so the helper (re)registers before enqueuing.
    Assets::enqueue_viewer_assets();

    $block = $this->resolve_block($id, $post);
    $block['attrs']['onlyPDF'] = true;

    return render_block($block);
  }

  public function pdf_embed($atts) {
    $attrs = shortcode_atts($this->pdf_embed_attrs(), $atts);

    // Without a URL the viewer mounts an empty container, so bail loudly instead.
    if (empty($attrs['url'])) {
      return current_user_can('manage_options') ? '<p style="color:red">PDF Poster: Please provide a file URL in the shortcode.</p>' : '';
    }

    $block = $this->pdf_embed_to_block($attrs);

    // One call, because the handles have to be asked for the same way everywhere: a
    // page builder rendering this shortcode over admin-ajax never ran
    // `wp_enqueue_scripts`, so the helper (re)registers before enqueuing.
    Assets::enqueue_viewer_assets();

    return render_block($block);
  }


  public function pdf_embed_attrs() {
    $options = get_option('fpdf_option', []);
    
    $height_opt = Utils::isset($options, 'height', ['height' => '842', 'unit' => 'px']);
    $width_opt = Utils::isset($options, 'width', ['width' => '100', 'unit' => '%']);
    
    $default_height = is_array($height_opt) ? ($height_opt['height'] . $height_opt['unit']) : '842px';
    $default_width = is_array($width_opt) ? ($width_opt['width'] . $width_opt['unit']) : '100%';

    return [
      'url' => null,
      'width' => $default_width,
      'height' => $default_height,
      'print' => 'false',
      'title' => null,
      'download_btn' => (Utils::isset($options, 'show_download_btn', '0') === '1') ? 'true' : 'false',
      'download_btn_text' => Utils::isset($options, 'download_btn_text', __('Download File', 'pdf-poster')),
      'show_name' => (Utils::isset($options, 'show_filename', '0') === '1') ? 'true' : 'false',
      'fullscreen_btn_text' => __('View Fullscreen', 'pdf-poster')
    ];
  }

  public function pdf_embed_to_block($attrs) {
    extract($attrs);

    if (empty($title) && !empty($url)) {
      $title = basename(wp_parse_url($url, PHP_URL_PATH));
      $title = str_replace(['-', '_'], ' ', $title);
      $title = ucwords(pathinfo($title, PATHINFO_FILENAME));
    }

    // Settings > Quick Embedder > Fullscreen Button. This was hard-coded true, so the
    // switcher on that screen could never do anything -- it is free now, so it has to
    // actually reach the shortcode. An absent option keeps the old behaviour.
    $fullscreen = Utils::pdfp_preset('view_fullscreen_btn', '1');

    return [
      "blockName" => "pdfp/pdfposter",
      "attrs" => [
        'uniqueId' => wp_unique_id('pdf-poster'),
        'file' => esc_url($url),
        'title' => esc_html($title),
        'titleFontSize' => '16px',
        'height' => esc_html($height),
        'width' => esc_html($width),
        'print' => $print === 'true',
        'showName' => $show_name === 'true',
        'downloadButton' => $download_btn === 'true',
        'downloadButtonText' => esc_html($download_btn_text),
        'fullscreenButtonText' => esc_html($fullscreen_btn_text),
        'fullscreenButton' => in_array($fullscreen, ['1', 1, true], true)
      ]
    ];
  }
}
}
