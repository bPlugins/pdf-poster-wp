<?php

namespace PDFPro\Admin;

use PDFPro\Helper\PDFP_Functions as Utils;

if (!defined('ABSPATH')) {
	exit;
}

if (!class_exists('PDFPro\Admin\PDFP_MetaBox')) {
	class PDFP_MetaBox {
		private $metabox_prefix = '_fpdf';
		private $option = null;

		public function register() {
			add_action('init', array($this, 'register_metabox'), 0);
		}

		public function register_metabox() {
			if (class_exists('\CSF')) {
				\CSF::createMetabox($this->metabox_prefix, array(
					'title' => __('Configure Your PDF', 'pdf-poster'),
					'post_type' => 'pdfposter',
					'theme' => 'light'
				));

				$this->configure();
				$this->controls();
				$this->actions();
				$this->popup();
				$this->protect_content();
				$this->watermark();
				$this->social_share();
				$this->styles();
				$this->advanced();
				$this->performance();
				$this->ads();
			}
		}

		/**
		 * Options for the Viewer button set.
		 *
		 * FlipBook and Slider are free, but they render through dFlip -- so they are only
		 * offered when that engine is actually on disk. Adobe and Scroll are Pro and are
		 * not listed at all: this build ships no upgrade modal to intercept the click, so
		 * a listed-but-locked option could be selected and then refused by
		 * PDFP_Functions::pdfp_resolve_viewer(). The General section's ledger names them
		 * instead.
		 */
		private function viewer_options() {
			$options = array(
				'default' => __('Default', 'pdf-poster'),
			); 

			if (Utils::pdfp_has_flipbook_engine()) {
				$options['flipbook'] = __('FlipBook', 'pdf-poster') . Utils::pdfp_new_badge();
				$options['slider'] = __('Slider', 'pdf-poster') . Utils::pdfp_new_badge();
			} 
			return $options;
		}

		public function configure() {
			if (!$this->option) {
				$this->option = get_option('fpdf_option');
			}

			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('General', 'pdf-poster'), "New"),
				'fields' => array(
					array(
						'id' => 'viewer',
						'type' => 'button_set',
						'title' => __('Viewer', 'pdf-poster'),
						'desc' => __('Select the PDF viewer engine.', 'pdf-poster'),
						'default' => 'default',
						'options' => $this->viewer_options()
					),
					array(
						'id' => 'source',
						'type' => 'upload',
						'title' => __('PDF Source', 'pdf-poster'),
						'desc' => __('Select or upload your PDF file.', 'pdf-poster'),
						'attributes' => array('id' => 'picker_field')
					),
					array(
						'id' => 'flipbook_source_type',
						'title' => __('Viewer Source', 'pdf-poster'),
						'type' => 'button_set',
						'default' => 'pdf',
						'options' => array(
							'pdf' => __('PDF File', 'pdf-poster'),
							'images' => __('Image Gallery', 'pdf-poster'),
						),
						'desc' => __('Build the flipbook, slider or scroll view from a PDF file or from an ordered set of images.', 'pdf-poster'),
						'dependency' => array('viewer', 'any', 'flipbook,slider,scroll', true)
					),
					array(
						'id' => 'flipbook_images',
						'title' => __('Pages (Images)', 'pdf-poster'),
						'type' => 'gallery',
						'desc' => __('Select images in the order they should appear as pages.', 'pdf-poster'),
						'dependency' => array(
							array('flipbook_source_type', '==', 'images'),
							array('viewer', 'any', 'flipbook,slider,scroll', true),
						)
					),
					array(
						'id' => 'device_preview',
						'type' => 'button_set',
						'title' => __('Preview Device', 'pdf-poster'),
						'options' => array(
							'desktop' => __('Desktop', 'pdf-poster'),
							'tablet' => __('Tablet', 'pdf-poster'),
							'mobile' => __('Mobile', 'pdf-poster'),
						),
						'default' => 'desktop',
					),
					array(
						'id' => 'height',
						'title' => __('Height (Desktop)', 'pdf-poster'),
						'type' => 'dimensions',
						'width' => false,
						'desc' => __('Set the height of the viewer for desktop.', 'pdf-poster'),
						'default' => Utils::pdfp_preset('preset_height', [
							'height' => 842,
							'unit' => 'px'
						]),
						'dependency' => array('device_preview', '==', 'desktop')
					),
					array(
						'id' => 'height_tablet',
						'title' => __('Height (Tablet)', 'pdf-poster'),
						'type' => 'dimensions',
						'width' => false,
						'desc' => __('Set the height of the viewer for tablet.', 'pdf-poster'),
						'default' => [
							'height' => 700,
							'unit' => 'px'
						],
						'dependency' => array('device_preview', '==', 'tablet')
					),
					array(
						'id' => 'height_mobile',
						'title' => __('Height (Mobile)', 'pdf-poster'),
						'type' => 'dimensions',
						'width' => false,
						'desc' => __('Set the height of the viewer for mobile.', 'pdf-poster'),
						'default' => [
							'height' => 400,
							'unit' => 'px'
						],
						'dependency' => array('device_preview', '==', 'mobile')
					),
					array(
						'id' => 'width',
						'title' => __('Width (Desktop)', 'pdf-poster'),
						'type' => 'dimensions',
						'height' => false,
						'desc' => __('Set the width of the viewer for desktop.', 'pdf-poster'),
						'default' => Utils::pdfp_preset('preset_width', [
							'width' => '100',
							'unit' => '%'
						]),
						'dependency' => array('device_preview', '==', 'desktop')
					),
					array(
						'id' => 'width_tablet',
						'title' => __('Width (Tablet)', 'pdf-poster'),
						'type' => 'dimensions',
						'height' => false,
						'desc' => __('Set the width of the viewer for tablet.', 'pdf-poster'),
						'default' => [
							'width' => '100',
							'unit' => '%'
						],
						'dependency' => array('device_preview', '==', 'tablet')
					),
					array(
						'id' => 'width_mobile',
						'title' => __('Width (Mobile)', 'pdf-poster'),
						'type' => 'dimensions',
						'height' => false,
						'desc' => __('Set the width of the viewer for mobile.', 'pdf-poster'),
						'default' => [
							'width' => '100',
							'unit' => '%'
						],
						'dependency' => array('device_preview', '==', 'mobile')
					),
					Utils::pro_feature_list(array(
						__('Industry-Leading Adobe Viewer', 'pdf-poster'),
						__('Continuous Scroll Viewer for Long Reports', 'pdf-poster'),
						__('Effortless Cloud Sync (Dropbox & Google Drive)', 'pdf-poster'),
					)),
				)
			));
		}

		public function controls()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('Controls', 'pdf-poster'), "New"),
				'fields' => array(
					array(
						'id' => 'show_filename',
						'title' => __('Display Filename', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_show_filename', true),
						'desc' => __('Show the filename at the top of the viewer.', 'pdf-poster')
					),
					array(
						'id' => 'keyboard_nav',
						'title' => __('Keyboard Navigation', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_keyboard_nav', false),
						'desc' => __('Let visitors use the Left/Right arrow keys to change pages.', 'pdf-poster')
					),
					array(
						'id' => 'rtl_mode',
						'title' => __('RTL Layout', 'pdf-poster'),
						'type' => 'button_set',
						'default' => 'off',
						'options' => array(
							'off' => __('Off', 'pdf-poster'),
							'on' => __('On', 'pdf-poster'),
							'auto' => __('Auto', 'pdf-poster'),
						),
						'desc' => __('Flip the viewer layout for right-to-left languages (Arabic, Hebrew, etc.). "Auto" follows the site language.', 'pdf-poster')
					),
					array(
						'id' => 'theme_mode',
						'title' => __('Viewer Theme', 'pdf-poster'),
						'type' => 'button_set',
						'default' => 'light',
						'options' => array(
							'light' => __('Light', 'pdf-poster'),
							'dark' => __('Dark', 'pdf-poster'),
							'auto' => __('Auto', 'pdf-poster'),
						),
						'desc' => __('Controls the viewer toolbar/background theme. "Auto" follows the visitor\'s system. This never changes the PDF page content itself.', 'pdf-poster')
					),
					array(
						'id' => 'flipbook_sound',
						'title' => __('Page Flip Sound', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_flipbook_sound', true),
						'desc' => __('Play a page-turn sound effect in Flipbook and Slider modes.', 'pdf-poster'),
						'dependency' => array('viewer', 'any', 'flipbook,slider', true)
					),
					array(
						'id' => 'annotation_mode',
						'title' => __('Annotation Mode', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_annotation_mode', true),
						'desc' => __('Show notes, highlights, comments, and clickable links that are saved inside the PDF.', 'pdf-poster'),
						'dependency' => array('viewer', '==', 'default', true)
					),
					array(
						'id' => 'open_links_in_new_tab',
						'title' => __('Open PDF links in new tab', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_open_links_in_new_tab', false),
						'desc' => __('Open links clicked inside the PDF in a new browser tab, keeping your current page open.', 'pdf-poster'),
						'dependency' => array(
							array('viewer', '==', 'default', true),
							array('annotation_mode', '==', '1', true)
						)
					),
					Utils::pro_feature_list(array(
						__("Distraction-Free 'Reader Mode'", 'pdf-poster'),
						__('Toggle Thumbnails Navigation', 'pdf-poster'),
						__('Auto-Open Sidebar by Default', 'pdf-poster'),
						__('Horizontal Scrollbar Support', 'pdf-poster'),
						__('Custom Initial Page & Zoom Level', 'pdf-poster'),
						__('Hide the Right-Side Toolbar', 'pdf-poster'),
						__('Adobe Embed Modes & View Modes', 'pdf-poster'),
					)),
				)
			));
		}

		public function actions()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => __('Actions', 'pdf-poster'),
				'fields' => array(
					array(
						'id' => 'print',
						'title' => __('Allow Printing', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_print'),
						'desc' => __('Allow visitors to print the PDF document.', 'pdf-poster')
					),
					array(
						'id' => 'show_download_btn',
						'title' => __('Download Button', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_show_download_btn', true),
						'desc' => __('Display a download button at the top of the viewer.', 'pdf-poster'),
						'dependency' => array('flipbook_source_type', '!=', 'images')
					),
					array(
						'id' => 'view_fullscreen_btn',
						'title' => __('Fullscreen Button', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_view_fullscreen_btn', true),
						'desc' => __('Display a fullscreen toggle button at the top of the viewer.', 'pdf-poster')
					),
					array(
						'id' => 'fullscreen_btn_text',
						'title' => __('Fullscreen Label', 'pdf-poster'),
						'type' => 'text',
						'desc' => __('Customize the text for the fullscreen button.', 'pdf-poster'),
						'default' => Utils::pdfp_preset('preset_fullscreen_btn_text', 'View Fullscreen'),
						'dependency' => array('view_fullscreen_btn', '==', '1', true)
					),
					Utils::pro_feature_list(array(
						__('Customize Download Button Label', 'pdf-poster'),
						__('Open Fullscreen in New Tab', 'pdf-poster'),
						__('Custom Actions Position (Top/Bottom)', 'pdf-poster'),
					)),
				)
			));
		}


		/**
		 * Popup (lightbox) trigger. Free.
		 *
		 * Every id here is the `popup_*` key generate_pdf_poster_block() maps into the
		 * block's popupOptions object, so the shortcode and the block draw the same
		 * trigger from the same values.
		 */
		public function popup()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => __('Popup', 'pdf-poster'),
				'fields' => array(
					array(
						'id' => 'popup',
						'title' => __('Enable Popup', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => __('Open the PDF document in a modal popup.', 'pdf-poster'),
						'default' => false,
					),
					array(
						'id' => 'popup_trigger_type',
						'title' => __('Trigger Type', 'pdf-poster'),
						'type' => 'button_set',
						'options' => array(
							'button' => __('Button', 'pdf-poster'),
							'image' => __('Image', 'pdf-poster'),
						),
						'default' => 'button',
						'desc' => __('Select the trigger type for the popup.', 'pdf-poster'),
						'dependency' => array('popup', '==', '1')
					),
					array(
						'id' => 'popup_trigger_alignment',
						'title' => __('Alignment', 'pdf-poster'),
						'type' => 'button_set',
						'options' => array(
							'left' => __('Left', 'pdf-poster'),
							'center' => __('Center', 'pdf-poster'),
							'right' => __('Right', 'pdf-poster'),
						),
						'default' => 'center',
						'desc' => __('Select the alignment for the popup trigger.', 'pdf-poster'),
						'dependency' => array('popup', '==', '1')
					),
					array(
						'id' => 'popup_image',
						'title' => __('Image', 'pdf-poster'),
						'type' => 'media',
						'library' => 'image',
						'desc' => __('Select an image to use as the popup trigger.', 'pdf-poster'),
						'dependency' => array('popup_trigger_type|popup', '==|==', 'image|1')
					),
					array(
						'id' => 'popup_btn_text',
						'title' => __('Button Text', 'pdf-poster'),
						'type' => 'text',
						'desc' => __('Customize the text for the popup trigger button.', 'pdf-poster'),
						'default' => 'Open PDF',
						'dependency' => array('popup_trigger_type|popup', '==|==', 'button|1')
					),
					array(
						'id' => 'popup_image_height',
						'title' => __('Image Height', 'pdf-poster'),
						'type' => 'dimensions',
						'width' => false,
						'desc' => __('Set the height for the trigger image.', 'pdf-poster'),
						'default' => [
							'height' => 200,
							'unit' => 'px'
						],
						'dependency' => array('popup_trigger_type|popup', '==|==', 'image|1')
					),
					array(
						'id' => 'popup_image_width',
						'title' => __('Image Width', 'pdf-poster'),
						'type' => 'dimensions',
						'height' => false,
						'desc' => __('Set the width for the trigger image.', 'pdf-poster'),
						'default' => [
							'width' => '300',
							'unit' => 'px'
						],
						'dependency' => array('popup_trigger_type|popup', '==|==', 'image|1')
					),
					array(
						'id' => 'popup_image_pdf_icon',
						'title' => __('Enable PDF Icon', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => __('Show a PDF icon over the trigger image.', 'pdf-poster'),
						'default' => true,
						'dependency' => array('popup_trigger_type|popup', '==|==', 'image|1')
					),
				),
			));
		}

		public function protect_content()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('Protect Content', 'pdf-poster')),
				'fields' => array(
					Utils::pro_feature_list(array(
						__('Disable Right-Click Interactions', 'pdf-poster'),
						__('Disable Text Selection', 'pdf-poster'),
						__('Suppress Blocked Warning Alerts', 'pdf-poster'),
					)),
				)
			));
		}

		/**
		 * Watermark & Branding.
		 *
		 * This build draws the TEXT mark in the three text themes and decides where it
		 * lands (Apply To, Pages). The logo mark, the Custom theme and everything it owns,
		 * Who Sees It and the Anti-leak pair are Pro -- and they are NOT rendered here as
		 * inert rows. The ledger at the foot of the section names them instead, which is
		 * how every other locked group in this metabox reads (see controls(), actions()
		 * and performance()).
		 *
		 * The clamp is not a UI concern either way: PDFP_Functions::pdfp_watermark_resolve()
		 * is the single point every render path funnels through, so hand-edited meta or a
		 * poster imported from Pro degrades to a look this build may draw.
		 *
		 * Every row below the Enable switch depends on it, so a poster that is not
		 * watermarked shows one toggle and the intro card -- and the intro card is the one
		 * thing that depends on the switch being OFF, so the two swap places.
		 */
		public function watermark() {
			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('Watermark & Branding', 'pdf-poster'), 'New'),
				'fields' => array(
					array(
						'id' => 'watermark_enable',
						'title' => __('Enable Watermark', 'pdf-poster'),
						'type' => 'switcher',
						'default' => false,
						'desc' => __('Stamp a text mark over the document.', 'pdf-poster'),
					),
					// The whole section below is gated on the Enable switch, so the panel is
					// one row until the author opts in. CSF stores an unchecked switcher as
					// "" rather than "0", so the intro asks for "anything but on".
					Utils::pdfp_watermark_intro(array('watermark_enable', '!=', '1')),
					Utils::pdfp_watermark_subhead(
						__('The mark', 'pdf-poster'),
						__('Your wording, and the look it is stamped in.', 'pdf-poster'),
						array('watermark_enable', '==', '1')
					),
					// No Mark Type row: text is the only mark this build renders, so a
					// button set with one usable choice would be a control that cannot be
					// used. The ledger below says what the other two modes are.
					array(
						'id' => 'watermark_theme',
						'title' => __('Theme', 'pdf-poster'),
						'type' => 'image_select',
						// Only the themes this build may draw -- pdfp_watermark_thumbs()
						// filters them, so the picker is right with JavaScript off too.
						'options' => Utils::pdfp_watermark_thumbs(),
						'default' => 'confidential',
						'desc' => __('Three ready-made looks. Each one sets the angle, repeat, weight and blend for you.', 'pdf-poster'),
						'dependency' => array('watermark_enable', '==', '1'),
					),
					array(
						'id' => 'watermark_text',
						'title' => __('Text', 'pdf-poster'),
						'type' => 'text',
						'default' => 'CONFIDENTIAL',
						'desc' => __('Supports placeholders such as {site_name}, {date} and {user_email}.', 'pdf-poster'),
						'dependency' => array('watermark_enable', '==', '1'),
					),
					Utils::pdfp_watermark_subhead(
						__('Where it shows', 'pdf-poster'),
						__('Which outputs, and which pages.', 'pdf-poster'),
						array('watermark_enable', '==', '1')
					),
					array(
						'id' => 'watermark_apply',
						'title' => __('Apply To', 'pdf-poster'),
						'type' => 'checkbox',
						'inline' => true,
						'options' => array(
							'screen'   => __('Viewer', 'pdf-poster'),
							'print'    => __('Printing', 'pdf-poster'),
							'download' => __('Downloads', 'pdf-poster'),
						),
						'default' => array('screen'),
						'desc' => __('Write the mark into printouts and downloaded copies, not just the viewer.', 'pdf-poster'),
						'dependency' => array('watermark_enable', '==', '1'),
					),
					array(
						'id' => 'watermark_pages',
						'title' => __('Pages', 'pdf-poster'),
						'type' => 'select',
						'options' => array(
							'all'          => __('All pages', 'pdf-poster'),
							'first'        => __('First page only', 'pdf-poster'),
							'except-first' => __('All except the cover', 'pdf-poster'),
						),
						'default' => 'all',
						'desc' => __('Brand just the cover, or gate everything after it.', 'pdf-poster'),
						'dependency' => array('watermark_enable', '==', '1'),
					),
					// Gated on the Enable switch like the rows it stands in for: while the
					// feature is off the intro card above is already doing the selling, and
					// two pitches stacked on one screen is one too many.
					array_merge(
						Utils::pro_feature_list(array(
							__('Logo Watermark (Image, or Text + Image)', 'pdf-poster'),
							__('Three More Themes (Brand Corner, Logo Wash, Logo + Caption)', 'pdf-poster'),
							__('Custom Theme — Your Own Colour, Coverage, Strength, Size & Angle', 'pdf-poster'),
							__('Choose Who Sees It (Everyone / Except Admins / Guests Only)', 'pdf-poster'),
							__('Per-Visitor Anti-Leak Stamp', 'pdf-poster'),
							__('Restore The Mark If A Visitor Removes It', 'pdf-poster'),
						)),
						array('dependency' => array('watermark_enable', '==', '1'))
					),
				)
			));
		}

		public function social_share()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => __('Social Share', 'pdf-poster'),
				'fields' => array(
					array(
						'id' => 'social_share',
						'title' => __('Enable Sharing', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => esc_html__('Enable social sharing buttons for the PDF.', 'pdf-poster'),
						'default' => false,
					),
					array(
						'id' => 'social_share_position',
						'title' => __('Share Position', 'pdf-poster'),
						'type' => 'select',
						'desc' => esc_html__('Select where the sharing buttons should appear.', 'pdf-poster'),
						'default' => 'top',
						'options' => array(
							'top' => esc_html__('Top', 'pdf-poster'),
							'bottom' => esc_html__('Bottom', 'pdf-poster'),
						),
						'dependency' => array('social_share', '==', '1', true)
					),
					array(
						'id' => 'social_share_facebook',
						'title' => __('Enable Facebook', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => esc_html__('Allow sharing on Facebook.', 'pdf-poster'),
						'default' => true,
						'dependency' => array('social_share', '==', '1', true)
					),
					array(
						'id' => 'social_share_twitter',
						'title' => __('Enable Twitter', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => esc_html__('Allow sharing on Twitter.', 'pdf-poster'),
						'default' => true,
						'dependency' => array('social_share', '==', '1', true)
					),
					array(
						'id' => 'social_share_linkedin',
						'title' => __('Enable LinkedIn', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => esc_html__('Allow sharing on LinkedIn.', 'pdf-poster'),
						'default' => true,
						'dependency' => array('social_share', '==', '1', true)
					),
					array(
						'id' => 'social_share_pinterest',
						'title' => __('Enable Pinterest', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => esc_html__('Allow sharing on Pinterest.', 'pdf-poster'),
						'default' => true,
						'dependency' => array('social_share', '==', '1')
					),
					array(
						'id' => 'social_share_mailto',
						'title' => __('Enable Email', 'pdf-poster'),
						'type' => 'switcher',
						'desc' => esc_html__('Allow sharing via Email.', 'pdf-poster'),
						'default' => true,
						'dependency' => array('social_share', '==', '1')
					),
				)
			));
		}

		public function styles()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => __('Styles', 'pdf-poster'),
				'fields' => array(
					array(
						'id' => 'popup_btn_bg',
						'title' => __('Button Background', 'pdf-poster'),
						'type' => 'color',
						'desc' => __('Choose a background color for the buttons.', 'pdf-poster'),
						'default' => '#1e73be',
					),
					array(
						'id' => 'popup_btn_color',
						'title' => __('Button Color', 'pdf-poster'),
						'type' => 'color',
						'desc' => __('Choose a text color for the buttons.', 'pdf-poster'),
						'default' => '#fff'
					),
					array(
						'id' => 'popup_btn_font_size',
						'title' => __('Font Size', 'pdf-poster'),
						'type' => 'number',
						'desc' => esc_html__('Set the font size for the buttons.', 'pdf-poster'),
						'default' => 1,
						'unit' => 'rem'
					),
					array(
						'id' => 'popup_btn_padding',
						'title' => __('Padding', 'pdf-poster'),
						'type' => 'spacing',
						'desc' => __('Set the internal spacing for the buttons.', 'pdf-poster'),
						'default' => [
							'top' => '10',
							'bottom' => '10',
							'left' => '20',
							'right' => '20',
						],
						'units' => array('px')
					),
				),
			));
		}

		/**
		 * Per-poster class and CSS. Free.
		 *
		 * generate_pdf_poster_block() maps these into the block's `additional` object,
		 * so the class lands on the viewer wrapper and the CSS is printed alongside the
		 * block container -- the same route the block sidebar's Additional panel uses.
		 */
		public function advanced()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('Advanced', 'pdf-poster'), "New"),
				'fields' => array(
					array(
						'id' => 'custom_class',
						'title' => __('CSS Class', 'pdf-poster'),
						'type' => 'text',
						'desc' => __('Extra class name added to this viewer, so you can target it from your theme or from the CSS below.', 'pdf-poster'),
						'default' => '',
					),
					array(
						'id' => 'custom_css',
						'title' => __('Custom CSS', 'pdf-poster'),
						'type' => 'code_editor',
						// CSF_Field_code_editor reads the mode out of ['settings'], not off
						// the field root -- a top-level 'mode' is silently ignored.
						'settings' => array('mode' => 'css'),
						'desc' => __('CSS for this poster only. Loaded wherever this poster is embedded, on top of the site-wide Custom CSS in Settings.', 'pdf-poster'),
						'default' => '',
					),
				),
			));
		}

		public function performance()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('Performance & Reliability', 'pdf-poster'), "New"),
				'fields' => array(
					array(
						'id' => 'progressive_loading',
						'title' => __('Fast Loading (Progressive Rendering)', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_progressive_loading', true),
						'desc' => __('Stream large PDFs so the first page appears sooner. Turn off only if your host mishandles range requests.', 'pdf-poster'),
					),
					array(
						'id' => 'default_browser',
						'title' => __('Google Doc Viewer', 'pdf-poster'),
						'type' => 'switcher',
						'default' => Utils::pdfp_preset('preset_default_browser'),
						'desc' => __('Enable Google Doc Viewer as a fallback (Recommended for Edge).', 'pdf-poster'),
					),
					Utils::pro_feature_list(array(
						__('Load Latest Document Version', 'pdf-poster'),
					)),
				)
			));
		}

		public function ads()
		{
			\CSF::createSection($this->metabox_prefix, array(
				'title' => Utils::pdfp_pro_title(__('Ads', 'pdf-poster'), "Upcoming"),
				'fields' => array(
					Utils::upcoming_section()
				)
			));
		}

	}
}
