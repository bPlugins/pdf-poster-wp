<?php

namespace PDFPro\Rest;

if (!defined('ABSPATH'))
    exit;

if (!class_exists('PDFPro\Rest\PDFP_Visitor')) {
    /**
     * Who is reading -- the values behind the {user_name}, {user_email} and {user_ip}
     * watermark placeholders.
     *
     * pdfp_watermark_resolve() deliberately leaves those three tokens unresolved, so one
     * reader's name is never written into a page cache and shown to the next. The viewer
     * asks for them here instead, once per page, after the HTML has been delivered.
     *
     * An admin-ajax action rather than a REST route: REST only honours the login cookie
     * when the request carries a nonce, and a nonce printed into cached HTML expires --
     * the reader would silently come back as a guest. admin-ajax reads the cookie on its
     * own. It is read-only and answers the caller about the caller, never anyone else,
     * and it sends no CORS headers, so another site cannot read the reply.
     */
    class PDFP_Visitor
    {
        const ACTION = 'pdfp_watermark_visitor';

        public function register()
        {
            add_action('wp_ajax_' . self::ACTION, array($this, 'respond'));
            add_action('wp_ajax_nopriv_' . self::ACTION, array($this, 'respond'));
        }

        public function respond()
        {
            // Per-visitor by definition: no layer may keep a copy.
            nocache_headers();

            $user = wp_get_current_user();

            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';

            wp_send_json(array(
                'userName'  => $user->exists() ? $user->display_name : '',
                'userEmail' => $user->exists() ? $user->user_email : '',
                'userIp'    => $ip,
            ));
        }
    }
}
