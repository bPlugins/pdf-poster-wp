<?php

namespace PDFPro\Admin;

use PDFPro\Helper\PDFP_Functions as Utils;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if (!class_exists('PDFPro\Admin\PDFP_AdminLoader')) {
	class PDFP_AdminLoader {
		public function __construct() {
			add_action('admin_enqueue_scripts', [$this, 'adminEnqueueScripts']);
			add_action('admin_menu', [$this, 'adminMenu'], 15);

			// Above everything that registers a page (CSF is 10, adminMenu is 15): the
			// Settings entry is created by CSF::createOptions(), which esc_attr()s its
			// menu_title, so the chip has to be written over $submenu afterwards.
			add_action('admin_menu', [$this, 'badgeSettingsMenu'], 999);
		}

		public function badgeSettingsMenu() {
			Utils::pdfp_badge_submenu(
				'edit.php?post_type=pdfposter',
				'fpdf-settings',
				Utils::pdfp_pro_title(__('Settings', 'pdf-poster'), 'New')
			);
		}

		public function adminEnqueueScripts($hook) {
			if (strpos($hook, 'pdf-poster') !== false) {
				$asset_file = file_exists(PDFPRO_PATH . 'build/dashboard.asset.php') 
					? include(PDFPRO_PATH . 'build/dashboard.asset.php') 
					: ['dependencies' => ['react', 'react-dom', 'wp-components', 'wp-api-fetch', 'wp-data'], 'version' => PDFPRO_VER];

				wp_enqueue_style('pdfp-dashboard-style', PDFPRO_PLUGIN_DIR . 'build/dashboard.css', [], $asset_file['version']);
				
				// Guarded on the file actually being enqueued: it used to test for
				// dashboard.css while enqueueing style-dashboard.css, which are emitted by
				// different rules -- the Analytics screen's styles live in the latter.
				if (file_exists(PDFPRO_PATH . 'build/style-dashboard.css')) {
					wp_enqueue_style('pdfp-dashboard-extra-style', PDFPRO_PLUGIN_DIR . 'build/style-dashboard.css', [], $asset_file['version']);
				}

				wp_enqueue_script('pdfp-dashboard-script', PDFPRO_PLUGIN_DIR . 'build/dashboard.js', array_merge($asset_file['dependencies'], ['react-dom']), $asset_file['version'], true);
				
				wp_localize_script('pdfp-dashboard-script', 'pdfpDashboard', [
					'dir' => PDFPRO_PLUGIN_DIR,
				]);
			}
		}

		public function adminMenu() {
			// Slug deliberately starts with 'pdf-poster' so it matches the
			// strpos($hook, 'pdf-poster') test in adminEnqueueScripts() and picks up the
			// dashboard bundle without a second condition to keep in step.
			add_submenu_page(
				'edit.php?post_type=pdfposter',
				__('Analytics', 'pdf-poster'),
				Utils::pdfp_pro_title(__('Analytics', 'pdf-poster'), 'New'),
				'edit_others_posts',
				'pdf-poster-analytics',
				[$this, 'analyticsPage'],
				14
			);

			add_submenu_page(
				'edit.php?post_type=pdfposter',
				__('Demo and Help', 'pdf-poster'),
				'<span style="color: #f18500;">' . __('Demo and Help', 'pdf-poster') . '</span>',
				'edit_others_posts',
				'pdf-poster',
				[$this, 'dashboardPage'],
				15
			);
		}

		public function dashboardPage() { 
			?>
			<div id='pdfpAdminDashboard' data-info='<?php echo esc_attr(wp_json_encode([
														'version' => PDFPRO_VER,
														'isPremium' => false,
														'hasPro' => false,
														// Trailing slash trimmed: every consumer in
														// src/dashboard/utils/data.js appends its own
														// '/wp-admin'-relative path.
														'adminUrl' => rtrim(admin_url(), '/'),
														'licenseActiveNonce' => wp_create_nonce('bPlLicenseActivation')
													])); ?>'></div>
			<?php
		}	

		/**
		 * PDF Poster > Analytics.
		 *
		 * Its own submenu rather than a link into the Demo and Help dashboard, so WordPress
		 * highlights the right item in the sidebar. Renders from the same bundle -- a
		 * separate mount id is all that distinguishes it. Counting is free, so this screen
		 * shows today's real figures; reading the history back is what upgrading turns on.
		 */
		public function analyticsPage() {
			?>
			<div id='pdfpAnalyticsPage' data-info='<?php echo esc_attr(wp_json_encode([
														'version' => PDFPRO_VER,
														'isPremium' => false,
														'hasPro' => false,
														'adminUrl' => rtrim(admin_url(), '/'),
													])); ?>'></div>
			<?php
		}

		public function upgradePage() { 
			?>
			<div id='pdfpAdminUpgrade' data-info='<?php echo esc_attr(wp_json_encode([
														'version' => PDFPRO_VER,
														'isPremium' => false,
														'hasPro' => false
													])); ?>'>Coming soon...</div>
			<?php
		}

	}
    new PDFP_AdminLoader();
}
