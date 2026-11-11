<?php

namespace PDFPro\Rest;

if (!defined('ABSPATH'))
    exit;

if (!class_exists('PDFPro\Rest\PDFP_Cover')) {
    /**
     * Auto Thumbnail -- the cover image of a PDF.
     *
     * One cover per PDF ATTACHMENT, never per poster or block: every embed of the same
     * file shares it. It is made once, in wp-admin, by the browser of whoever uploaded
     * the PDF (pdf.js, assets/admin/js/auto-thumbnail.js), or copied from WordPress's own
     * PDF preview when the host made one. A page view only ever READS it.
     *
     * Stored on the PDF attachment:
     *   _pdfp_cover_id     image attachment id
     *   _pdfp_cover_auto   '1' made by us, '0' chosen or removed by a person (never overwritten)
     *   _pdfp_cover_hash   size-mtime of the PDF when the cover was made (stale check)
     *   _pdfp_cover_page   page it was drawn from
     *   _pdfp_cover_error  why the last attempt failed (cleared on success)
     * Stored on the image:
     *   _pdfp_cover_of     the PDF it belongs to
     */
    class PDFP_Cover
    {
        const META_ID = '_pdfp_cover_id';
        const META_AUTO = '_pdfp_cover_auto';
        const META_HASH = '_pdfp_cover_hash';
        const META_PAGE = '_pdfp_cover_page';
        const META_ERROR = '_pdfp_cover_error';
        const META_OF = '_pdfp_cover_of';

        const MAX_UPLOAD_BYTES = 8388608; // 8 MB is far above any 3000 px JPEG/WebP page.
        const ERRORS = array('unreadable', 'password', 'invalid', 'timeout', 'failed');

        /** Guards delete_attachment re-entry while we delete a cover ourselves. */
        private static $deleting = false;

        public function register()
        {
            add_action('rest_api_init', array($this, 'register_routes'));
            add_filter('wp_generate_attachment_metadata', array($this, 'copy_core_preview'), 20, 3);
            add_action('delete_attachment', array($this, 'on_delete_attachment'));
        }

        /* ---------------------------------------------------------------------------
         * Settings
         * ------------------------------------------------------------------------ */

        /**
         * Settings > Auto Thumbnail. Missing keys
         * mean the defaults: the section only writes them once it has been saved.
         */
        public static function settings()
        {
            static $settings = null;
            if (null !== $settings) {
                return $settings;
            }

            $o = get_option('fpdf_option');
            $o = is_array($o) ? $o : array();
            $flag = function ($key, $default) use ($o) {
                return array_key_exists($key, $o) ? ((string) $o[$key] === '1') : $default;
            };

            // The page, the image width and the format are chosen in the Pro version;
            // this build always draws page 1 at 1200 px as a JPEG.
            $settings = array(
                'enabled' => $flag('pdfp_autothumb_enable', true),
                'popup' => $flag('pdfp_autothumb_popup', true),
                'coverFirst' => $flag('pdfp_autothumb_cover_first', false),
                'page' => 1,
                'width' => 1200,
                'format' => 'jpeg',
            );

            return $settings;
        }

        /* ---------------------------------------------------------------------------
         * Read side (render.php, admin UI)
         * ------------------------------------------------------------------------ */

        public static function is_pdf($id)
        {
            $id = (int) $id;
            return $id > 0
                && 'attachment' === get_post_type($id)
                && in_array(strtolower((string) get_post_mime_type($id)), array('application/pdf', 'application/x-pdf'), true);
        }

        /**
         * Which Media Library PDF an embed shows, cheapest source first.
         *
         * An id is only trusted while its file name still matches the embed's URL (ids are
         * not stable across imports). Without an id, a URL inside this site's uploads is
         * looked up once and the answer cached, so a page view never repeats the query.
         */
        public static function pdf_id_for($file, $ids = array())
        {
            foreach ((array) $ids as $id) {
                $id = (int) $id;
                if ($id > 0 && self::is_pdf($id) && self::same_file($file, wp_get_attachment_url($id))) {
                    return $id;
                }
            }

            return self::pdf_id_from_url($file);
        }

        public static function pdf_id_from_url($url)
        {
            if (!is_string($url) || '' === $url) {
                return 0;
            }

            $path = wp_parse_url($url, PHP_URL_PATH);
            $uploads = wp_upload_dir(null, false);
            $base = wp_parse_url($uploads['baseurl'] ?? '', PHP_URL_PATH);
            if (!is_string($path) || !is_string($base) || 0 !== strpos($path, trailingslashit($base))) {
                return 0;
            }
            if ('pdf' !== strtolower((string) pathinfo($path, PATHINFO_EXTENSION))) {
                return 0;
            }

            $key = 'pdfp_cover_pdf_' . md5($path);
            $cached = get_transient($key);
            if (false !== $cached) {
                return (int) $cached;
            }

            $id = (int) attachment_url_to_postid(home_url($path));
            if (!$id) {
                $id = (int) attachment_url_to_postid($uploads['baseurl'] . substr($path, strlen(untrailingslashit($base))));
            }
            $id = self::is_pdf($id) ? $id : 0;

            set_transient($key, (string) $id, DAY_IN_SECONDS);
            return $id;
        }

        private static function same_file($a, $b)
        {
            if (!is_string($a) || '' === trim($a) || !is_string($b) || '' === $b) {
                return true;
            }
            $pa = wp_parse_url($a, PHP_URL_PATH);
            $pb = wp_parse_url($b, PHP_URL_PATH);
            if (!is_string($pa) || !is_string($pb)) {
                return true;
            }
            return wp_basename(rawurldecode($pa)) === wp_basename(rawurldecode($pb));
        }

        /** The cover image id of a PDF, or 0. */
        public static function cover_id($pdf_id)
        {
            $id = (int) get_post_meta((int) $pdf_id, self::META_ID, true);
            return ($id && wp_attachment_is_image($id)) ? $id : 0;
        }

        /**
         * What the viewer needs to draw a cover: one image, with srcset so a phone does
         * not download the 1200 px original, and its size so the page does not jump.
         */
        public static function cover_data($pdf_id, $alt = '')
        {
            $id = self::cover_id($pdf_id);
            if (!$id) {
                return null;
            }

            $src = wp_get_attachment_image_src($id, 'large');
            if (!$src) {
                return null;
            }

            return array(
                'id' => $id,
                'src' => $src[0],
                'width' => (int) $src[1],
                'height' => (int) $src[2],
                'srcset' => (string) wp_get_attachment_image_srcset($id, 'large'),
                'sizes' => (string) wp_get_attachment_image_sizes($id, 'large'),
                'alt' => $alt !== '' ? $alt : get_the_title((int) $pdf_id),
            );
        }

        /** size-mtime of the PDF on disk; '' when it cannot be read (offloaded media). */
        public static function file_hash($pdf_id)
        {
            $path = get_attached_file((int) $pdf_id);
            if (!$path || !@file_exists($path)) { // phpcs:ignore WordPress.PHP.NoSilencedErrors
                return '';
            }
            return @filesize($path) . '-' . @filemtime($path); // phpcs:ignore WordPress.PHP.NoSilencedErrors
        }

        /** Everything the admin UI shows about one PDF's cover. */
        public static function state($pdf_id)
        {
            $pdf_id = (int) $pdf_id;
            $cover = self::cover_data($pdf_id);
            $auto = get_post_meta($pdf_id, self::META_AUTO, true);
            $hash = (string) get_post_meta($pdf_id, self::META_HASH, true);
            $now = self::file_hash($pdf_id);
            $thumb = $cover ? wp_get_attachment_image_src($cover['id'], 'medium') : null;

            return array(
                'pdfId' => $pdf_id,
                // Site-relative: pdf.js must fetch it from whichever host the admin is on.
                'url' => wp_make_link_relative((string) wp_get_attachment_url($pdf_id)),
                'title' => get_the_title($pdf_id),
                'cover' => $cover,
                'thumb' => $thumb ? $thumb[0] : '',
                'auto' => $cover ? '0' !== $auto : true,
                'removed' => !$cover && '0' === $auto,
                'stale' => (bool) ($cover && '0' !== $auto && '' !== $hash && '' !== $now && $hash !== $now),
                'page' => (int) get_post_meta($pdf_id, self::META_PAGE, true),
                'error' => (string) get_post_meta($pdf_id, self::META_ERROR, true),
            );
        }

        /* ---------------------------------------------------------------------------
         * REST
         * ------------------------------------------------------------------------ */

        public function register_routes()
        {
            register_rest_route('pdfp/v1', '/cover/(?P<id>\d+)', array(
                array(
                    'methods' => 'GET',
                    'callback' => array($this, 'get_cover'),
                    'permission_callback' => array($this, 'can_edit_pdf'),
                ),
                array(
                    'methods' => 'POST',
                    'callback' => array($this, 'save_cover'),
                    'permission_callback' => array($this, 'can_edit_pdf'),
                ),
                array(
                    'methods' => 'DELETE',
                    'callback' => array($this, 'remove_cover'),
                    'permission_callback' => array($this, 'can_edit_pdf'),
                ),
            ));

            register_rest_route('pdfp/v1', '/covers/missing', array(
                'methods' => 'GET',
                'callback' => array($this, 'missing'),
                'permission_callback' => function () {
                    return current_user_can('upload_files');
                },
            ));
        }

        public function can_edit_pdf(\WP_REST_Request $request)
        {
            $id = (int) $request['id'];
            if (!self::is_pdf($id)) {
                return new \WP_Error('pdfp_not_pdf', __('That is not a PDF in the Media Library.', 'pdf-poster'), array('status' => 404));
            }
            return current_user_can('upload_files') && current_user_can('edit_post', $id);
        }

        public function get_cover(\WP_REST_Request $request)
        {
            return rest_ensure_response(self::state((int) $request['id']));
        }

        /**
         * Three ways in:
         *   file      a page the browser rendered (multipart)  -> automatic cover
         *   image_id  an image a person picked                 -> manual cover
         *   error     why the browser could not render it      -> recorded for the UI
         */
        public function save_cover(\WP_REST_Request $request)
        {
            $pdf_id = (int) $request['id'];

            $error = (string) $request->get_param('error');
            if ('' !== $error) {
                $error = in_array($error, self::ERRORS, true) ? $error : 'failed';
                update_post_meta($pdf_id, self::META_ERROR, $error);
                return rest_ensure_response(self::state($pdf_id));
            }

            $image_id = (int) $request->get_param('image_id');
            if ($image_id) {
                if (!wp_attachment_is_image($image_id) || !current_user_can('edit_post', $image_id)) {
                    return new \WP_Error('pdfp_bad_image', __('Choose an image from the Media Library.', 'pdf-poster'), array('status' => 400));
                }
                self::attach($pdf_id, $image_id, false, 0);
                return rest_ensure_response(self::state($pdf_id));
            }

            $files = $request->get_file_params();
            $file = $files['file'] ?? null;
            if (!$file || !empty($file['error']) || empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
                return new \WP_Error('pdfp_no_file', __('No image was received.', 'pdf-poster'), array('status' => 400));
            }
            if ((int) $file['size'] > self::MAX_UPLOAD_BYTES) {
                return new \WP_Error('pdfp_too_big', __('The cover image is too large.', 'pdf-poster'), array('status' => 413));
            }

            // A person's choice is never overwritten by the robot.
            if ('0' === get_post_meta($pdf_id, self::META_AUTO, true) && !$request->get_param('force')) {
                return rest_ensure_response(self::state($pdf_id));
            }

            $mime = wp_get_image_mime($file['tmp_name']);
            $ext = array('image/jpeg' => 'jpg', 'image/webp' => 'webp', 'image/png' => 'png')[$mime] ?? '';
            if ('' === $ext) {
                return new \WP_Error('pdfp_bad_type', __('The cover must be a JPEG, WebP or PNG image.', 'pdf-poster'), array('status' => 415));
            }

            $name = sanitize_file_name(wp_basename((string) get_attached_file($pdf_id), '.pdf') . '-cover.' . $ext);
            $image_id = self::sideload($file['tmp_name'], $name, $pdf_id, false);
            if (is_wp_error($image_id)) {
                return $image_id;
            }

            self::attach($pdf_id, $image_id, true, max(1, (int) $request->get_param('page')));
            return rest_ensure_response(self::state($pdf_id));
        }

        /** Remove the cover and stop making one, until someone asks for it again. */
        public function remove_cover(\WP_REST_Request $request)
        {
            $pdf_id = (int) $request['id'];
            self::drop_cover($pdf_id);
            update_post_meta($pdf_id, self::META_AUTO, '0');
            delete_post_meta($pdf_id, self::META_ERROR);
            return rest_ensure_response(self::state($pdf_id));
        }

        /**
         * PDFs that still need a cover, for the bulk run. Skips PDFs that already failed
         * or that a person removed the cover from, so a run always ends.
         */
        public function missing(\WP_REST_Request $request)
        {
            $limit = min(50, max(1, (int) ($request->get_param('limit') ?: 20)));
            $base = array(
                'post_type' => 'attachment',
                'post_status' => 'inherit',
                'post_mime_type' => array('application/pdf', 'application/x-pdf'),
                'fields' => 'ids',
            );

            $query = new \WP_Query($base + array(
                'posts_per_page' => $limit,
                'orderby' => 'ID',
                'order' => 'DESC',
                'meta_query' => array(
                    'relation' => 'AND',
                    array('key' => self::META_ID, 'compare' => 'NOT EXISTS'),
                    array('key' => self::META_ERROR, 'compare' => 'NOT EXISTS'),
                    array('key' => self::META_AUTO, 'compare' => 'NOT EXISTS'),
                ),
            ));

            $items = array();
            foreach ($query->posts as $id) {
                if (current_user_can('edit_post', $id)) {
                    $items[] = array('id' => (int) $id, 'url' => wp_make_link_relative((string) wp_get_attachment_url($id)));
                }
            }

            return rest_ensure_response(array(
                'items' => $items,
                'missing' => (int) $query->found_posts,
                'counts' => self::counts(),
            ));
        }

        /** Totals for the Settings screen. Two COUNT queries, admin only. */
        public static function counts()
        {
            $q = new \WP_Query(array(
                'post_type' => 'attachment',
                'post_status' => 'inherit',
                'post_mime_type' => array('application/pdf', 'application/x-pdf'),
                'fields' => 'ids',
                'posts_per_page' => 1,
            ));
            $with = new \WP_Query(array(
                'post_type' => 'attachment',
                'post_status' => 'inherit',
                'post_mime_type' => array('application/pdf', 'application/x-pdf'),
                'fields' => 'ids',
                'posts_per_page' => 1,
                'meta_query' => array(array('key' => self::META_ID, 'compare' => 'EXISTS')),
            ));

            return array('total' => (int) $q->found_posts, 'withCover' => (int) $with->found_posts);
        }

        /* ---------------------------------------------------------------------------
         * Writing a cover
         * ------------------------------------------------------------------------ */

        private static function sideload($tmp, $name, $pdf_id, $copy)
        {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            if ($copy) {
                $temp = wp_tempnam($name);
                if (!$temp || !@copy($tmp, $temp)) { // phpcs:ignore WordPress.PHP.NoSilencedErrors
                    return new \WP_Error('pdfp_copy_failed', __('Could not copy the preview.', 'pdf-poster'));
                }
                $tmp = $temp;
            }

            $title = sprintf(
                /* translators: %s: PDF title */
                __('%s – cover', 'pdf-poster'),
                get_the_title($pdf_id)
            );

            $image_id = media_handle_sideload(array('name' => $name, 'tmp_name' => $tmp), $pdf_id, $title);
            if (is_wp_error($image_id)) {
                if ($copy) {
                    @unlink($tmp); // phpcs:ignore WordPress.PHP.NoSilencedErrors
                }
                return $image_id;
            }

            update_post_meta($image_id, '_wp_attachment_image_alt', get_the_title($pdf_id));
            return (int) $image_id;
        }

        /** Make $image_id the cover of $pdf_id, retiring the previous automatic one. */
        public static function attach($pdf_id, $image_id, $auto, $page)
        {
            $old = (int) get_post_meta($pdf_id, self::META_ID, true);

            update_post_meta($pdf_id, self::META_ID, (int) $image_id);
            update_post_meta($pdf_id, self::META_AUTO, $auto ? '1' : '0');
            update_post_meta($pdf_id, self::META_PAGE, (int) $page);
            update_post_meta($pdf_id, self::META_HASH, self::file_hash($pdf_id));
            delete_post_meta($pdf_id, self::META_ERROR);
            if ($auto) {
                update_post_meta($image_id, self::META_OF, (int) $pdf_id);
            }

            if ($old && $old !== (int) $image_id) {
                self::move_thumbnails($old, (int) $image_id);
                self::delete_if_ours($old, $pdf_id);
            }

            do_action('pdfp_cover_updated', (int) $pdf_id, (int) $image_id);
        }

        private static function drop_cover($pdf_id)
        {
            $old = (int) get_post_meta($pdf_id, self::META_ID, true);
            delete_post_meta($pdf_id, self::META_ID);
            delete_post_meta($pdf_id, self::META_HASH);
            delete_post_meta($pdf_id, self::META_PAGE);
            if ($old) {
                self::move_thumbnails($old, 0);
                self::delete_if_ours($old, $pdf_id);
            }
        }

        /** PDF Posters that showed the old cover as their featured image follow the new one. */
        private static function move_thumbnails($old, $new)
        {
            $posters = get_posts(array(
                'post_type' => 'pdfposter',
                'post_status' => 'any',
                'fields' => 'ids',
                'posts_per_page' => 200,
                'meta_query' => array(array('key' => '_thumbnail_id', 'value' => (int) $old)),
            ));
            foreach ($posters as $poster) {
                if ($new) {
                    set_post_thumbnail($poster, $new);
                } else {
                    delete_post_thumbnail($poster);
                }
            }
        }

        /**
         * Delete an image only if we made it for this PDF and nothing outside PDF Poster
         * uses it as a featured image. A person's own image is never deleted.
         */
        private static function delete_if_ours($image_id, $pdf_id)
        {
            if ((int) get_post_meta($image_id, self::META_OF, true) !== (int) $pdf_id) {
                return;
            }
            $users = get_posts(array(
                'post_type' => 'any',
                'post_status' => 'any',
                'fields' => 'ids',
                'posts_per_page' => 1,
                'meta_query' => array(array('key' => '_thumbnail_id', 'value' => (int) $image_id)),
            ));
            if ($users) {
                return;
            }

            self::$deleting = true;
            wp_delete_attachment($image_id, true);
            self::$deleting = false;
        }

        /* ---------------------------------------------------------------------------
         * WordPress hooks
         * ------------------------------------------------------------------------ */

        /**
         * Shortcut: when the server itself can render PDFs (Imagick + Ghostscript),
         * WordPress already made a page-1 preview on upload. Copy it; the browser then
         * has nothing to do. Only for page 1 -- core never renders another page.
         */
        public function copy_core_preview($metadata, $attachment_id, $context = 'create')
        {
            if ('create' !== $context || empty($metadata['sizes']['full']['file']) || !self::is_pdf($attachment_id)) {
                return $metadata;
            }
            $settings = self::settings();
            if (!$settings['enabled'] || 1 !== (int) $settings['page'] || self::cover_id($attachment_id)) {
                return $metadata;
            }

            $preview = path_join(dirname((string) get_attached_file($attachment_id)), $metadata['sizes']['full']['file']);
            if (!@file_exists($preview)) { // phpcs:ignore WordPress.PHP.NoSilencedErrors
                return $metadata;
            }

            $name = sanitize_file_name(wp_basename((string) get_attached_file($attachment_id), '.pdf') . '-cover.jpg');
            $image_id = self::sideload($preview, $name, $attachment_id, true);
            if (!is_wp_error($image_id)) {
                self::attach((int) $attachment_id, $image_id, true, 1);
            }

            return $metadata;
        }

        public function on_delete_attachment($post_id)
        {
            if (self::$deleting) {
                return;
            }

            // A PDF going away takes its automatic cover with it.
            if (self::is_pdf($post_id)) {
                $cover = (int) get_post_meta($post_id, self::META_ID, true);
                if ($cover) {
                    self::delete_if_ours($cover, $post_id);
                }
                return;
            }

            // A person deleted the cover image itself: respect that, do not remake it.
            $pdf_id = (int) get_post_meta($post_id, self::META_OF, true);
            if ($pdf_id && (int) get_post_meta($pdf_id, self::META_ID, true) === (int) $post_id) {
                delete_post_meta($pdf_id, self::META_ID);
                delete_post_meta($pdf_id, self::META_HASH);
                update_post_meta($pdf_id, self::META_AUTO, '0');
            }
        }

        /* ---------------------------------------------------------------------------
         * Front end
         * ------------------------------------------------------------------------ */

        /**
         * Resolve the per-embed Cover first setting: 'on' / 'off' / 'default' (site setting).
         * Booleans are accepted for embeds built in code.
         */
        public static function cover_first_on($value)
        {
            if (true === $value || 'on' === $value || '1' === $value) {
                return true;
            }
            if ('default' === $value || '' === $value || null === $value) {
                return self::settings()['coverFirst'];
            }
            return false;
        }

        /* ---------------------------------------------------------------------------
         * Cover look
         *
         * Mirrored in src/blocks/pdf-poster/components/Common/coverStyle.js -- keep the
         * defaults, the classes and the custom properties in step.
         * ------------------------------------------------------------------------ */

        const STYLE_DEFAULTS = array(
            'bgOn' => true,
            'bg' => '#525659',
            'radius' => 4,
            'height' => 'viewer',   // viewer | auto
            'fit' => 'contain',     // contain | cover
            'imgWidth' => 100,      // % of the box
            'shadow' => true,
            'btnPos' => 'below',    // below | bottom | center | none
            'btnBg' => '#2271b1',
            'btnColor' => '#ffffff',
            'btnHoverBg' => '#135e96',
            'btnHoverColor' => '#ffffff',
            'btnSize' => 15,
            'btnRadius' => 4,
            'btnPadding' => array('top' => 11, 'right' => 20, 'bottom' => 11, 'left' => 20),
        );

        /**
         * Every cover in this build uses the standard look above. Designing the cover
         * (background, size, fit, the Open button's colours and placement) is part of
         * the Pro version, so nothing here reads a stored design.
         */
        public static function effective_style($embed = array())
        {
            return self::STYLE_DEFAULTS;
        }

        /** [class list, style attribute] for a cover box. */
        public static function style_attrs(array $attributes)
        {
            $s = self::effective_style();
            $height = $attributes['height'] ?? '';
            $width = $attributes['width'] ?? '';
            $h = is_array($height) ? $height : array('desktop' => $height);
            $w = is_array($width) ? ($width['desktop'] ?? '100%') : ($width ?: '100%');
            $p = $s['btnPadding'];

            $vars = array(
                '--pdfp-cover-w' => $w,
                '--pdfp-cover-h' => $h['desktop'] ?? '600px',
                '--pdfp-cover-h-t' => $h['tablet'] ?? ($h['desktop'] ?? '600px'),
                '--pdfp-cover-h-m' => $h['mobile'] ?? ($h['desktop'] ?? '600px'),
                '--pdfp-cover-bg' => $s['bgOn'] ? $s['bg'] : 'transparent',
                '--pdfp-cover-radius' => $s['radius'] . 'px',
                '--pdfp-cover-img-w' => $s['imgWidth'] . '%',
                '--pdfp-cover-btn-bg' => $s['btnBg'],
                '--pdfp-cover-btn-color' => $s['btnColor'],
                '--pdfp-cover-btn-hover-bg' => $s['btnHoverBg'],
                '--pdfp-cover-btn-hover-color' => $s['btnHoverColor'],
                '--pdfp-cover-btn-size' => $s['btnSize'] . 'px',
                '--pdfp-cover-btn-radius' => $s['btnRadius'] . 'px',
                '--pdfp-cover-btn-pad' => sprintf('%dpx %dpx %dpx %dpx', $p['top'], $p['right'], $p['bottom'], $p['left']),
            );
            $style = '';
            foreach ($vars as $k => $v) {
                $style .= $k . ':' . $v . ';';
            }

            $classes = array('pdfp_cover', 'pdfp_cover--btn-' . $s['btnPos'], 'pdfp_cover--fit-' . $s['fit']);
            if ('auto' === $s['height']) {
                $classes[] = 'pdfp_cover--h-auto';
            }
            if (!$s['shadow']) {
                $classes[] = 'pdfp_cover--flat';
            }
            if (!$s['bgOn']) {
                $classes[] = 'pdfp_cover--nobg';
            }

            return array(implode(' ', $classes), $style);
        }

        /**
         * The server-side cover, printed before the viewer script runs so it paints at
         * once and holds its space. view.js replaces it with the same markup
         * (CoverPoster.js).
         */
        public static function markup(array $attributes)
        {
            $cover = $attributes['cover'] ?? null;
            $title = (string) ($attributes['title'] ?? '');
            $text = (string) ($attributes['coverButtonText'] ?? '');
            $text = '' !== $text ? $text : __('Open document', 'pdf-poster');
            list($classes, $style) = self::style_attrs($attributes);
            $show_btn = false === strpos($classes, 'pdfp_cover--btn-none');

            ob_start();
            ?>
            <div class="<?php echo esc_attr($classes); ?>" style="<?php echo esc_attr($style); ?>">
                <button type="button" class="pdfp_cover_open" aria-label="<?php echo esc_attr(trim($text . ' ' . $title)); ?>">
                    <span class="pdfp_cover_media">
                    <?php if (!empty($cover['id'])) {
                        echo wp_get_attachment_image((int) $cover['id'], 'large', false, array('class' => 'pdfp_cover_img', 'alt' => (string) ($cover['alt'] ?? '')));
                    } elseif (!empty($cover['src'])) { ?>
                        <img class="pdfp_cover_img" src="<?php echo esc_url($cover['src']); ?>" alt="" decoding="async">
                    <?php } else { ?>
                        <span class="pdfp_cover_fallback"><span class="pdfp_cover_doc" aria-hidden="true">PDF</span><span class="pdfp_cover_name"><?php echo esc_html($title); ?></span></span>
                    <?php } ?>
                    </span>
                    <?php if ($show_btn) { ?>
                        <span class="pdfp_cover_btn"><?php echo esc_html($text); ?></span>
                    <?php } ?>
                </button>
            </div>
            <?php
            return ob_get_clean();
        }
    }
}
