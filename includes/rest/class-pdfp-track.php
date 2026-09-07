<?php

namespace PDFPro\Rest;

use PDFPro\Helper\PDFP_Functions as Utils;

if (!defined('ABSPATH'))
    exit;

if (!class_exists('PDFPro\Rest\PDFP_Track')) {
    /**
     * The one public write surface in the plugin.
     *
     * Everything else PDF Poster does is read-only rendering, so this route is treated
     * as hostile input from end to end: a fixed event vocabulary, a key format that must
     * match what render.php issued, a hard cap on batch size, per-visitor rate limiting,
     * and de-duplication before a single row is touched.
     *
     * It is public on purpose -- an anonymous visitor is the thing being counted, so
     * there is no nonce to check. A nonce would also be baked into cached HTML and expire,
     * which is precisely the failure mode this whole design exists to avoid.
     */
    class PDFP_Track
    {
        /** Events the endpoint will accept, mapped to their stats column. */
        const EVENTS = array(
            'view'       => 'views',
            'download'   => 'downloads',
            'print'      => 'prints',
            'fullscreen' => 'fullscreens',
            'share'      => 'shares',
        );

        /** How long one visitor's event for one document is considered a repeat. */
        const DEDUPE = array(
            'view'       => 1800, // 30 minutes
            'download'   => 2,
            'print'      => 2,
            'fullscreen' => 2,
            'share'      => 2,
        );

        const MAX_EVENTS_PER_REQUEST = 20;
        const MAX_REQUESTS_PER_MINUTE = 60;

        public function register()
        {
            add_action('rest_api_init', array($this, 'register_routes'));
        }

        public function register_routes()
        {
            register_rest_route('pdfp/v1', '/track', array(
                'methods' => 'POST',
                'callback' => array($this, 'track'),
                'permission_callback' => '__return_true',
                'args' => array(
                    'events' => array(
                        'required' => true,
                        'type' => 'array',
                    ),
                ),
            ));
        }

        /**
         * Accept a batch of events.
         *
         * Always answers 204 with no body. sendBeacon discards the response anyway, and
         * a silent endpoint gives nothing back to someone probing it.
         */
        public function track(\WP_REST_Request $request)
        {
            $noop = new \WP_REST_Response(null, 204);

            if (!Utils::pdfp_should_count()) {
                return $noop;
            }

            $events = $request->get_param('events');
            if (!is_array($events) || empty($events)) {
                return $noop;
            }

            $visitor = Utils::pdfp_visitor_hash();

            if ($this->is_rate_limited($visitor)) {
                return $noop;
            }

            $events = array_slice($events, 0, self::MAX_EVENTS_PER_REQUEST);

            // Collapse the batch first, so six identical events in one payload become one
            // increment and one query instead of six of each.
            $pending = array();

            foreach ($events as $event) {
                if (!is_array($event)) {
                    continue;
                }

                $type = isset($event['type']) ? sanitize_key($event['type']) : '';
                $doc = isset($event['doc']) ? sanitize_text_field($event['doc']) : '';
                $origin = isset($event['origin']) ? absint($event['origin']) : 0;

                if (!isset(self::EVENTS[$type]) || !Utils::pdfp_is_doc_key($doc)) {
                    continue;
                }

                if ($this->is_duplicate($visitor, $doc, $type)) {
                    continue;
                }

                $column = self::EVENTS[$type];
                if (!isset($pending[$doc])) {
                    $pending[$doc] = array('_origin' => 0);
                }
                $pending[$doc][$column] = (isset($pending[$doc][$column]) ? $pending[$doc][$column] : 0) + 1;

                if ($origin > 0) {
                    $pending[$doc]['_origin'] = $origin;
                }
            }

            foreach ($pending as $doc => $columns) {
                $this->record($doc, $columns);
            }

            return $noop;
        }

        /**
         * Cheap flood guard. One counter per visitor hash per minute, in the object
         * cache where one exists.
         */
        protected function is_rate_limited($visitor)
        {
            $key = 'pdfp_rl_' . $visitor;
            $hits = (int) get_transient($key);

            if ($hits >= self::MAX_REQUESTS_PER_MINUTE) {
                return true;
            }

            set_transient($key, $hits + 1, MINUTE_IN_SECONDS);
            return false;
        }

        /**
         * Has this visitor already been counted for this document and event?
         *
         * The window is what makes a "view" mean something: reloading an article five
         * times in ten minutes is one person reading one document, not five views.
         */
        protected function is_duplicate($visitor, $doc, $type)
        {
            $window = isset(self::DEDUPE[$type]) ? self::DEDUPE[$type] : 2;
            $key = 'pdfp_s_' . substr(md5($visitor . '|' . $doc . '|' . $type), 0, 24);

            if (get_transient($key)) {
                return true;
            }

            set_transient($key, 1, $window);
            return false;
        }

        /**
         * Write the increments for one document.
         *
         * A single INSERT ... ON DUPLICATE KEY UPDATE against the (doc_id, day) unique
         * key. Never read-then-write: two visitors landing in the same millisecond both
         * get counted, which a SELECT-modify-UPDATE pair cannot guarantee.
         */
        protected function record($doc, $columns)
        {
            global $wpdb;

            $table = Utils::pdfp_stats_table();
            $post_id = Utils::pdfp_doc_post_id($doc);
            $day = current_time('Y-m-d');

            // Not a counter: pulled out before the loop that sums the rest.
            $origin = isset($columns['_origin']) ? (int) $columns['_origin'] : 0;
            unset($columns['_origin']);

            $names = array_keys($columns);
            $insert_cols = array();
            $insert_placeholders = array();
            $updates = array();
            $values = array($doc, $post_id, $day);

            foreach ($names as $name) {
                $insert_cols[] = $name;
                $insert_placeholders[] = '%d';
                $values[] = (int) $columns[$name];
                // Back-tick-free identifiers: $names only ever holds values from
                // self::EVENTS, never anything that came off the wire.
                $updates[] = "{$name} = {$name} + VALUES({$name})";
            }

            // Neither of these is a counter: last_seen is the most recent moment, and
            // origin_post_id the most recent page. Both are set, never summed -- and the
            // origin only overwrites when the new one is real, so a beacon that arrives
            // without one cannot erase the page we already knew about.
            $values[] = current_time('mysql');
            $values[] = $origin;

            $sql = "INSERT INTO {$table} (doc_id, post_id, day, " . implode(', ', $insert_cols) . ", last_seen, origin_post_id)"
                . " VALUES (%s, %d, %s, " . implode(', ', $insert_placeholders) . ", %s, %d)"
                . " ON DUPLICATE KEY UPDATE " . implode(', ', $updates)
                . ", last_seen = VALUES(last_seen)"
                . ", origin_post_id = IF(VALUES(origin_post_id) > 0, VALUES(origin_post_id), origin_post_id)";

            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $wpdb->query($wpdb->prepare($sql, $values));

            $this->mirror_meta($post_id, $columns);
        }

        /**
         * Keep the all-time totals on the post itself.
         *
         * The only reason these exist: they make the Views and Downloads columns on the
         * PDF Posters list sortable through `orderby=meta_value_num`, with no join and no
         * query cost. Every other read goes to the stats table.
         */
        protected function mirror_meta($post_id, $columns)
        {
            if ($post_id <= 0) {
                return;
            }

            $map = array('views' => '_pdfp_views', 'downloads' => '_pdfp_downloads');

            foreach ($map as $column => $meta_key) {
                if (empty($columns[$column])) {
                    continue;
                }
                $current = (int) get_post_meta($post_id, $meta_key, true);
                update_post_meta($post_id, $meta_key, $current + (int) $columns[$column]);
            }
        }
    }
}
