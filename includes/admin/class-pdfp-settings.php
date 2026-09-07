<?php

namespace PDFPro\Admin;

use PDFPro\Helper\PDFP_Functions as Utils;

if (! defined('ABSPATH')) exit;

if ( ! class_exists( 'PDFPro\Admin\PDFP_Settings' ) ) {
	class PDFP_Settings {

	private $option_prefix = 'fpdf_option';
	public function register() {
		add_action('init', array($this, 'init'), 0);
	}


	public function init() {
		if (class_exists('\CSF')) {
			\CSF::createOptions($this->option_prefix, array(
				'framework_title' => __('PDF Poster Settings', 'pdf-poster'),
				'menu_title'  => __('Settings', 'pdf-poster'),
				'menu_slug'   => 'fpdf-settings',
				'menu_type'   => 'submenu',
				'menu_parent' => 'edit.php?post_type=pdfposter',
				'theme' => 'light',
				'show_bar_menu' => false,
				'footer_text' => 'Thank you for using PDF Poster',
			));
			

			$this->shortcode();
			$this->gutenberg_integration();
			$this->analytics();
			$this->custom_css();
			$this->preset();
			$this->cloud_api();
		}
	}

	public function shortcode() {
		\CSF::createSection($this->option_prefix, array(
			'title' => __('Quick Embedder', 'pdf-poster'),
			'fields' => array(
				array(
					'type'    => 'content',
					'content' => '
						<div class="pdfp-docs-notice">
							<div class="pdfp-docs-notice-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
							</div>
							<div class="pdfp-docs-notice-content">
								<h4>' . __('Documentation & Help', 'pdf-poster') . '</h4>
								<p>' . __('Need help configuring the Quick Embedder? Check out our full documentation for expert tips and advanced settings.', 'pdf-poster') . '</p>
							</div>
							<div class="pdfp-docs-notice-action">
								<a href="https://bplugins.com/docs/pdf-poster/settings/quick-embedder-2/" target="_blank" class="pdfp-docs-btn">
									' . __('View Documentation', 'pdf-poster') . '
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
								</a>
							</div>
						</div>
					'
				),
				Utils::quick_embed_shortcode(),
				array(
					'id' => 'height',
					'title' => __('Viewer Height', 'pdf-poster'),
					'type' => 'dimensions',
					'default' => [
						'height' => '800',
						'unit' => 'px'
					],
					'width' => false,
					'desc' => __('Set the height of the PDF viewer.', 'pdf-poster')
				),
				array(
					'id' => 'width',
					'title' => __('Viewer Width', 'pdf-poster'),
					'type' => 'dimensions',
					'default' => [
						'width' => '100',
						'unit' => '%'
					],
					'height' => false,
					'desc' => __('Set the width of the PDF viewer.', 'pdf-poster')
				),
				array(
					'id' => 'show_filename',
					'title' => __('Display Filename', 'pdf-poster'),
					'type' => 'switcher',
					'desc' => __('Show the filename at the top of the viewer.', 'pdf-poster')
				),
				array(
					'id' => 'show_download_btn',
					'title' => __('Download Button', 'pdf-poster'),
					'type' => 'switcher',
					'desc' => __('Display a download button at the top of the viewer.', 'pdf-poster')
				),
				array(
					'id' => 'download_btn_text',
					'title' => __('Download Label', 'pdf-poster'),
					'type' => 'text',
					'default' => 'Download File',
					'desc' => __('Custom text for the download button.', 'pdf-poster'),
					'dependency' => array('show_download_btn', '==', '1')
				),
				array(
					'id' => 'view_fullscreen_btn',
					'title' => __('Fullscreen Button', 'pdf-poster'),
					'type' => 'switcher',
					'default' => true,
					'desc' => __('Display a fullscreen toggle button at the top of the viewer.', 'pdf-poster')
				),
				Utils::pro_feature_list(array(
					__('Enable Printing', 'pdf-poster'),
					__('Default Browser Viewer Support', 'pdf-poster'),
					__('Open Fullscreen in New Tab', 'pdf-poster'),
					__('Advanced Content Protection (Disable Right-Click)', 'pdf-poster'),
					__('Suppress Blocked Warning Alerts', 'pdf-poster'),
					__('Enable Thumbnails Navigation', 'pdf-poster'),
				)),
			)
		));
	}

	public function gutenberg_integration() {
		\CSF::createSection($this->option_prefix, array(
			'title' => __('Shortcode', 'pdf-poster'),
			'fields' => array(
				array(
					'id' => 'pdfp_gutenberg_enable',
					'type' => 'switcher',
					'title' => __('Gutenberg Integration', 'pdf-poster'),
					'desc' => __('Enable the PDF Poster block and shortcode generator in the Gutenberg editor.', 'pdf-poster'),
					'default' => get_option('pdfp_gutenberg_enable', false)
				)
			)
		));
	}

	/**
	 * Analytics -- the site-wide counting switches.
	 *
	 * All three are free: counting is either correct for everyone or it is not worth
	 * shipping. What Pro buys is reading the numbers back over a date range, not the
	 * right to collect them.
	 */
	public function analytics() {
		\CSF::createSection($this->option_prefix, array(
			'title' => Utils::pdfp_pro_title(__('Analytics', 'pdf-poster'), "New"),
			'fields' => array(
				array(
					'id' => 'pdfp_tracking_enable',
					'type' => 'switcher',
					'title' => __('Count Views & Downloads', 'pdf-poster'),
					'default' => true,
					'desc' => __('Record how often each PDF is opened and downloaded. Counting happens in the visitor\'s browser, so it keeps working behind a page cache. Today\'s figures appear on the PDF Posters list and beside each document.', 'pdf-poster'),
				),
				array(
					'id' => 'pdfp_tracking_exclude_editors',
					'type' => 'switcher',
					'title' => __('Exclude Logged-in Editors', 'pdf-poster'),
					'default' => true,
					'desc' => __('Do not count visits by users who can edit posts, so your own previews stay out of the numbers.', 'pdf-poster'),
					'dependency' => array('pdfp_tracking_enable', '==', '1'),
				),
				array(
					'id' => 'pdfp_tracking_respect_dnt',
					'type' => 'switcher',
					'title' => __('Respect "Do Not Track"', 'pdf-poster'),
					'default' => false,
					'desc' => __('Skip counting for visitors whose browser sends a Do Not Track header.', 'pdf-poster'),
					'dependency' => array('pdfp_tracking_enable', '==', '1'),
				),
				array(
					'type' => 'content',
					'content' => '<div class="pdfp-docs-notice"><div class="pdfp-docs-notice-content"><h4>'
						. esc_html__('What counts as a view', 'pdf-poster') . '</h4><p>'
						. esc_html__('A view is recorded once the viewer has actually rendered and been on screen for a second -- not on every page load. Repeat views by the same visitor are counted once per 30 minutes, and no IP address is ever stored.', 'pdf-poster')
						. '</p></div></div>',
				),
				// The retention disclosure. This build shows today, but every day is
				// written -- so this has to be said plainly on the screen where counting
				// is switched on, not discovered later.
				array(
					'type' => 'content',
					'content' => '<div class="pdfp-docs-notice"><div class="pdfp-docs-notice-content"><h4>'
						. esc_html__('Today, and everything before it', 'pdf-poster') . '</h4><p>'
						. esc_html__('This plugin shows you today\'s views and downloads. Earlier days are still recorded, in your own database and nowhere else, so upgrading to Pro reads back the history this site has already built -- totals, trends, your best-performing documents and a report you can export. There is nothing to import and no data leaves your server.', 'pdf-poster')
						. '</p></div></div>',
				),
			)
		));
	}

	/**
	 * Site-wide Custom CSS.
	 *
	 * The saved rules are printed in wp_head (see pdf-poster.php), so they load after
	 * the viewer's own stylesheet and win on equal specificity. Nothing wrote this
	 * option before -- the section listed the feature instead of offering it, so the
	 * printer in wp_head had nothing to print.
	 */
	public function custom_css() {
		\CSF::createSection($this->option_prefix, array(
			'title' => __('Custom CSS', 'pdf-poster'),
			'fields' => array(
				array(
					'id' => 'custom_css',
					'type' => 'code_editor',
					'title' => __('Custom CSS', 'pdf-poster'),
					'desc' => __('Add your custom CSS here to override the viewer styles. It is loaded on every page of your site, after the plugin stylesheet.', 'pdf-poster'),
					// CSF_Field_code_editor reads the mode out of ['settings'], not off the
					// field root -- a top-level 'mode' is silently ignored and the editor
					// falls back to htmlmixed highlighting.
					'settings' => array('mode' => 'css')
				)
			)
		));
	}

	/**
	 * Preset -- the site-wide defaults every new PDF Poster starts from.
	 *
	 * Each id here is the `preset_*` key PDFP_MetaBox reads through
	 * Utils::pdfp_preset(), so a value saved on this screen becomes the default of the
	 * matching metabox field. The section listed the feature before rather than
	 * offering it, which meant every pdfp_preset() lookup fell through to its
	 * hard-coded fallback.
	 *
	 * Changing a preset only affects posters created afterwards -- CSF writes a field's
	 * default into meta the first time a poster is saved, so existing posters keep
	 * whatever they already have.
	 *
	 * Every field here is free, so there is no locked row: a preset is only worth
	 * offering when the metabox field it defaults exists, and the ledger at the foot
	 * names the defaults Pro adds along with the settings behind them.
	 */
	public function preset() {
		\CSF::createSection($this->option_prefix, array(
			'title' => __('Preset', 'pdf-poster'),
			'fields' => array(
				array(
					'content' => __('These are the defaults for newly created PDF Posters. Existing posters are not changed.', 'pdf-poster'),
					'type' => 'heading'
				),
				array(
					'id' => 'preset_height',
					'title' => __('Viewer Height', 'pdf-poster'),
					'type' => 'dimensions',
					'width' => false,
					'desc' => __('Set the default height for preset viewers.', 'pdf-poster'),
					'default' => [
						'height' => 842,
						'unit' => 'px'
					]
				),
				array(
					'id' => 'preset_width',
					'title' => __('Viewer Width', 'pdf-poster'),
					'type' => 'dimensions',
					'height' => false,
					'desc' => __('Set the default width for preset viewers.', 'pdf-poster'),
					'default' => [
						'width' => '100',
						'unit' => '%'
					]
				),
				array(
					'id' => 'preset_print',
					'title' => __('Enable Printing', 'pdf-poster'),
					'type' => 'switcher',
					'default' => 0,
					'desc' => __('Allow visitors to print the PDF document.', 'pdf-poster')
				),
				array(
					'id' => 'preset_show_filename',
					'title' => __('Display Filename', 'pdf-poster'),
					'type' => 'switcher',
					'default' => true,
					'desc' => __('Show the filename at the top of the viewer.', 'pdf-poster')
				),
				array(
					'id' => 'preset_show_download_btn',
					'title' => __('Download Button', 'pdf-poster'),
					'type' => 'switcher',
					'default' => 0,
					'desc' => __('Display a download button at the top of the viewer.', 'pdf-poster')
				),
				array(
					'id' => 'preset_download_btn_text',
					'title' => __('Download Label', 'pdf-poster'),
					'type' => 'text',
					'default' => 'Download File',
					'desc' => __('Custom text for the download button.', 'pdf-poster'),
					'dependency' => array('preset_show_download_btn', '==', '1')
				),
				array(
					'id' => 'preset_view_fullscreen_btn',
					'title' => __('Fullscreen Button', 'pdf-poster'),
					'type' => 'switcher',
					'default' => true,
					'desc' => __('Display a fullscreen toggle button at the top of the viewer.', 'pdf-poster')
				),
				array(
					'id' => 'preset_fullscreen_btn_text',
					'title' => __('Fullscreen Label', 'pdf-poster'),
					'type' => 'text',
					'default' => 'View Fullscreen',
					'desc' => __('Custom text for the fullscreen button.', 'pdf-poster'),
					'dependency' => array('preset_view_fullscreen_btn', '==', '1')
				),
				array(
					'id' => 'preset_open_links_in_new_tab',
					'title' => __('Open PDF links in new tab', 'pdf-poster'),
					'type' => 'switcher',
					'default' => 0,
					'desc' => __('Open links clicked inside the PDF in a new browser tab, keeping your current page open.', 'pdf-poster')
				),
				array(
					'id' => 'preset_annotation_mode',
					'title' => __('Annotation Mode', 'pdf-poster'),
					'type' => 'switcher',
					'default' => 1,
					'desc' => __('Show notes, highlights, comments, and clickable links that are saved inside the PDF.', 'pdf-poster')
				),
				array(
					'id' => 'preset_keyboard_nav',
					'title' => __('Keyboard Navigation', 'pdf-poster'),
					'type' => 'switcher',
					'default' => 0,
					'desc' => __('Let visitors page through the document with the arrow keys.', 'pdf-poster')
				),
				array(
					'id' => 'preset_flipbook_sound',
					'title' => __('Page Flip Sound', 'pdf-poster'),
					'type' => 'switcher',
					'default' => true,
					'desc' => __('Play the page-turn sound in the FlipBook and Slider viewers.', 'pdf-poster')
				),
				array(
					'id' => 'preset_progressive_loading',
					'title' => __('Fast Loading (Progressive Rendering)', 'pdf-poster'),
					'type' => 'switcher',
					'default' => true,
					'desc' => __('Stream large PDFs so the first page appears sooner. Turn off only if your host mishandles range requests.', 'pdf-poster')
				),
				array(
					'id' => 'preset_default_browser',
					'title' => __('Google Doc Viewer', 'pdf-poster'),
					'type' => 'switcher',
					'default' => 0,
					'desc' => __('Enable Google Doc Viewer as a fallback (Recommended for Edge).', 'pdf-poster')
				),
				// The defaults Pro adds here, because it adds the settings they default.
				// Listed rather than shown as locked rows: a preset with no metabox field
				// behind it is a switch wired to nothing.
				Utils::pro_feature_list(array(
					__('Reader Mode Default', 'pdf-poster'),
					__('Thumbnails & Auto-Open Sidebar Defaults', 'pdf-poster'),
					__('Content Protection Defaults (Right-Click, Warning Alerts)', 'pdf-poster'),
					__('Horizontal Scrollbar Default', 'pdf-poster'),
					__('Open Fullscreen in New Tab Default', 'pdf-poster'),
					__('Load Latest Document Version Default', 'pdf-poster'),
				)),
			)
		));
	}

	public function cloud_api() {
		\CSF::createSection($this->option_prefix, array(
			'title' => Utils::pdfp_pro_title(__('Cloud Integration', 'pdf-poster')),
			'fields' => array(
				Utils::pro_feature_list(array(
					__('Direct Dropbox Connectivity', 'pdf-poster'),
					__('Google Drive Cloud Picker', 'pdf-poster'),
					__('Premium Adobe PDF Embed API', 'pdf-poster'),
					__('Seamless External Hosting', 'pdf-poster'),
				)),
			)
		));
	}
}
}
