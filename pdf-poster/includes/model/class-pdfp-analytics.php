<?php

namespace PDFPro\Model;

use PDFPro\Helper\PDFP_Functions as Utils;

if (!defined('ABSPATH'))
    exit;

if (!class_exists('PDFPro\Model\PDFP_Analytics')) {
    /**
     * Read side of Document Insights.
     *
     * Reached through the existing dispatcher -- POST pdfp/v1/ajax with
     * `model=Analytics&method=totals` -- which already enforces `edit_posts`. That is
     * why there is no permission code in here: adding a second admin endpoint would
     * mean a second thing to get wrong.
     *
     * Note on tiering: PDFP_Init::instantiate() swaps a class for its `...Pro` subclass
     * for *registered services*, but Rest\PDFP_AjaxCall instantiates by name straight
     * off the request. So entitlement is checked inside the methods here rather than by
     * class substitution.
     *
     * The line: totals() answers for EVERY build, but a free build gets only `today`.
     * summary() and export() -- every reading of the past -- stay behind
     * can_use_premium_code(). Nothing is gated on the write side; see pdfp_should_count().
     */
    class PDFP_Analytics
    {
        /**
         * All-time totals for one document.
         *
         * Three ways to name the document, in falling order of precision:
         *
         *   doc   an already-resolved key
         *   post  a saved poster's id      -> p:<id>
         *   file  the PDF's url            -> u:<sha1 of the normalised url>
         *
         * `file` exists for a block dropped straight onto a page or post: there is no
         * poster behind it, and the key is a sha1 the browser cannot compute -- so the
         * editor sends the url and the server derives the key with the SAME helper
         * render.php uses, which is what guarantees the two agree.
         *
         * Answers for every build. `pro` in the response says which shape came back:
         * false means `today` only, true adds the all-time totals, the sparkline and the
         * trend. Callers must branch on that flag rather than on a missing key.
         *
         * @param array $data
         * @return \WP_REST_Response
         */
        public function totals($data = array()) {
            global $wpdb;

            $doc = isset($data['doc']) ? sanitize_text_field($data['doc']) : '';
            $post = isset($data['post']) ? (int) $data['post'] : 0;
            $file = isset($data['file']) ? esc_url_raw($data['file']) : '';

            if ($doc === '' && $post > 0) {
                $doc = 'p:' . $post;
            }

            if ($doc === '' && $file !== '') {
                $doc = Utils::pdfp_doc_key($file, 0);
            }

            if (!Utils::pdfp_is_doc_key($doc)) {
                return new \WP_REST_Response(array('error' => 'invalid document'), 400);
            }

            $table = Utils::pdfp_stats_table();

            // Every tier gets today, and the date counting began so the number has a
            // visible provenance. A bare 0 with nothing beside it reads as a bug.
            $today = Utils::pdfp_doc_today($doc);

            $payload = array(
                'doc' => $doc,
                'pro' => Utils::pdfp_analytics_available(),
                'today' => $today,
                'firstDay' => Utils::pdfp_first_day($doc),
                'countingSince' => Utils::pdfp_counting_since_text($doc),
                'reportUrl' => admin_url('edit.php?post_type=pdfposter&page=pdf-poster-analytics'),
                'reportDocUrl' => add_query_arg(
                    'doc',
                    $doc,
                    admin_url('edit.php?post_type=pdfposter&page=pdf-poster-analytics')
                ),
                'tracking' => Utils::pdfp_tracking_enabled(),
                'excludeEditors' => Utils::pdfp_excluding_editors(),
            );

            // Free build: today only. The history is being recorded either way -- what a
            // licence buys is reading it back -- so the keys below are OMITTED rather than
            // sent as zeros. A zero would be a lie the panel could not tell apart from a
            // document nobody has opened.
            if (!$payload['pro']) {
                // How much of the past is already on disk. The panel states it rather
                // than promising a feature, so it is only computed on the tier that
                // draws it.
                $payload['history'] = Utils::pdfp_recorded_history($doc);

                return new \WP_REST_Response($payload, 200);
            }

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT SUM(views) AS views, SUM(downloads) AS downloads, SUM(prints) AS prints, MAX(day) AS last_day, MAX(last_seen) AS last_seen
                     FROM {$table} WHERE doc_id = %s",
                    $doc
                ),
                ARRAY_A
            );

            // A 14-day sparkline ships with the totals rather than as a second call: the
            // panel draws both together, and two requests could render a trend that
            // disagrees with the number above it.
            $spark = Utils::pdfp_doc_series($doc, 14);
            $half = (int) floor(count($spark) / 2);
            $recent = array_sum(array_slice($spark, $half));
            $earlier = array_sum(array_slice($spark, 0, $half));

            return new \WP_REST_Response(array_merge($payload, array(
                'views' => isset($row['views']) ? (int) $row['views'] : 0,
                'downloads' => isset($row['downloads']) ? (int) $row['downloads'] : 0,
                'prints' => isset($row['prints']) ? (int) $row['prints'] : 0,
                'lastDay' => isset($row['last_day']) ? $row['last_day'] : null,
                'lastSeen' => isset($row['last_seen']) ? $row['last_seen'] : null,
                'spark' => $spark,
                'sparkDays' => 14,
                'trend' => $earlier > 0 ? (int) round((($recent - $earlier) / $earlier) * 100) : null,
            )), 200);
        }

        /**
         * Every document that could be reported on, for the report's document picker.
         *
         * Answers for every tier -- the picker is on both, so gating it would leave the
         * free screen with a filter it could not populate.
         *
         * THREE sources, because no single one is complete:
         *   1. every saved poster, including ones nobody has opened yet (a picker that
         *      hides a document until it has traffic is a picker people report as broken);
         *   2. every doc_id in the stats table, which is the only place an ad-hoc embed
         *      that has been read shows up;
         *   3. the content scan, which finds embeds that exist on a page but have not
         *      been read yet.
         *
         * Split into two groups rather than one flat list: a saved poster and a url-keyed
         * embed are different kinds of thing, and the embed's honest name is the page it
         * sits on, not the file.
         *
         * @return \WP_REST_Response
         */
        public function documents($data = array())
        {
            global $wpdb;

            $posters = array();
            $embeds = array();

            // 1. Saved posters. Capped: this fills a <select>, and a site with thousands
            // of documents needs a search field, not a longer dropdown -- which is a
            // different control and a different change.
            $posts = get_posts(array(
                'post_type' => 'pdfposter',
                'post_status' => array('publish', 'draft', 'pending', 'private', 'future'),
                'numberposts' => 500,
                'orderby' => 'title',
                'order' => 'ASC',
                'suppress_filters' => false,
            ));

            foreach ($posts as $post) {
                $title = $this->plain_title($post);
                $posters[] = array(
                    'doc' => 'p:' . (int) $post->ID,
                    'title' => $title !== '' ? $title : sprintf(
                        /* translators: %d: post id of an untitled document */
                        __('(no title) · %d', 'pdf-poster'),
                        (int) $post->ID
                    ),
                );
            }

            // 2. Url-keyed documents that have been counted at least once.
            $table = Utils::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $seen = $wpdb->get_col("SELECT DISTINCT doc_id FROM {$table} WHERE doc_id LIKE 'u:%' LIMIT 500");

            // 3. Embeds sitting in content that nobody has opened yet.
            $keys = array_unique(array_merge((array) $seen, array_keys(Utils::pdfp_embed_origin_map())));

            foreach ($keys as $key) {
                if (strpos((string) $key, 'u:') !== 0) {
                    continue;
                }

                $origin = $this->origin_of($this->origin_for_doc($key), $key);
                $hash = substr((string) $key, 2, 6);

                $embeds[] = array(
                    'doc' => $key,
                    // Named by the page it is embedded on, because "Embedded file · a1b2c3"
                    // is not something anyone can pick out of a list. The hash stays as a
                    // disambiguator when one page carries several embeds.
                    'title' => !empty($origin['title'])
                        ? sprintf(
                            /* translators: 1: page title, 2: short file identifier */
                            __('%1$s · %2$s', 'pdf-poster'),
                            $origin['title'],
                            $hash
                        )
                        : sprintf(
                            /* translators: %s: short identifier for an ad-hoc embedded file */
                            __('Embedded file · %s', 'pdf-poster'),
                            $hash
                        ),
                );
            }

            usort($embeds, function ($a, $b) {
                return strcasecmp($a['title'], $b['title']);
            });

            return new \WP_REST_Response(array(
                'posters' => $posters,
                'embeds' => $embeds,
            ), 200);
        }

        /**
         * TODAY, site-wide. What the Analytics screen shows a free build.
         *
         * Answers for every tier. It exists because summary() is Pro and a free screen
         * still needs something true to draw -- and because "today" is a single day's
         * rows, which is one indexed read rather than the range work summary() does.
         *
         * Deliberately NOT a thin wrapper over summary(): sharing that code would mean
         * either loosening its gate or threading a tier flag through four queries, and
         * both put the paid boundary somewhere harder to see than a method name.
         *
         * @param array $data Optional `doc` to narrow to one document.
         * @return \WP_REST_Response
         */
        public function today($data = array())
        {
            global $wpdb;

            $table = Utils::pdfp_stats_table();
            $doc = $this->resolve_doc($data);
            $day = current_time('Y-m-d');

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT doc_id, MAX(post_id) AS post_id, MAX(origin_post_id) AS origin_post_id,
                            SUM(views) AS views, SUM(downloads) AS downloads
                     FROM {$table} WHERE day = %s" . ($doc ? " AND doc_id = %s" : "") . "
                     GROUP BY doc_id ORDER BY views DESC, downloads DESC LIMIT 20",
                    $doc ? array($day, $doc) : array($day)
                ),
                ARRAY_A
            );

            $views = 0;
            $downloads = 0;
            $docs = array();

            foreach ((array) $rows as $row) {
                $views += (int) $row['views'];
                $downloads += (int) $row['downloads'];

                $post_id = (int) $row['post_id'];
                $title = $post_id ? $this->plain_title($post_id) : '';
                $origin = array();

                if ($title === '') {
                    $title = sprintf(
                        /* translators: %s: short identifier for an ad-hoc embedded file */
                        __('Embedded file · %s', 'pdf-poster'),
                        substr((string) $row['doc_id'], 2, 6)
                    );
                    $origin = $this->origin_of((int) $row['origin_post_id'], $row['doc_id']);
                }

                $docs[] = array(
                    'doc' => $row['doc_id'],
                    'postId' => $post_id,
                    'title' => $title,
                    'editUrl' => $post_id ? get_edit_post_link($post_id, 'raw') : '',
                    'isEmbed' => $post_id === 0,
                    'origin' => $origin,
                    'views' => (int) $row['views'],
                    'downloads' => (int) $row['downloads'],
                );
            }

            $pro = Utils::pdfp_analytics_available();

            $payload = array(
                'day' => $day,
                'pro' => $pro,
                'doc' => $doc,
                'docTitle' => $doc ? $this->doc_title($doc) : null,
                'totals' => array('views' => $views, 'downloads' => $downloads),
                'docs' => $docs,
                // COUNT(DISTINCT), not count($docs): the list above is capped at 20 for
                // the table, so counting it would report "20" on any site with more than
                // twenty documents touched in a day and never move again.
                'docCount' => $this->window_doc_count($day, $day, $doc),
                'firstDay' => Utils::pdfp_first_day($doc),
                'countingSince' => Utils::pdfp_counting_since_text($doc),
                'tracking' => Utils::pdfp_tracking_enabled(),
                'excludeEditors' => Utils::pdfp_excluding_editors(),
            );

            // Free build only: the locked-history card is the sole consumer, and a
            // licensed screen draws summary() instead and never asks this question.
            if (!$pro) {
                $payload['history'] = Utils::pdfp_recorded_history($doc);
            }

            return new \WP_REST_Response($payload, 200);
        }

        /**
         * Everything the Analytics screen draws, in one request.
         *
         * One round trip rather than four, because every panel on that page describes the
         * same window and splitting it would let the tiles and the chart disagree while
         * requests land out of order.
         *
         * Pro. The free build still gets TODAY through totals() above -- what Pro buys is
         * reading the history back over a range, which is where the work is. The rows
         * exist either way, so this starts answering the moment a licence activates,
         * with no import step.
         *
         * `doc` narrows every panel to one document -- what the "Show Analytics" button
         * on a poster opens. Omit it for the site-wide view.
         *
         * @param array $data days|from|to|doc
         * @return \WP_REST_Response
         */
        public function summary($data = array())
        {
            // The helper, not pdfp_fs() directly: it is the single definition of the tier
            // line, and one gate spelled two ways is a boundary nobody can audit.
            if (!Utils::pdfp_analytics_available()) {
                return new \WP_REST_Response(array('error' => 'pro_required'), 403);
            }

            global $wpdb;
            $table = Utils::pdfp_stats_table();

            list($from, $to, $days) = $this->resolve_range($data);
            $doc = $this->resolve_doc($data);

            // The window immediately before this one, same length, for the deltas.
            $prev_to = gmdate('Y-m-d', strtotime($from . ' -1 day'));
            $prev_from = gmdate('Y-m-d', strtotime($prev_to . ' -' . ($days - 1) . ' day'));

            $totals = $this->window_totals($from, $to, $doc);
            $previous = $this->window_totals($prev_from, $prev_to, $doc);

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT day, SUM(views) AS views, SUM(downloads) AS downloads
                     FROM {$table} WHERE day BETWEEN %s AND %s" . ($doc ? " AND doc_id = %s" : "") . "
                     GROUP BY day ORDER BY day ASC",
                    $doc ? array($from, $to, $doc) : array($from, $to)
                ),
                ARRAY_A
            );

            // Zero-fill: a gap in the data is a day nobody read anything, and a line chart
            // that simply skips it draws a slope that never happened.
            $by_day = array();
            foreach ((array) $rows as $row) {
                $by_day[$row['day']] = array('views' => (int) $row['views'], 'downloads' => (int) $row['downloads']);
            }

            $series = array();
            for ($i = 0; $i < $days; $i++) {
                $day = gmdate('Y-m-d', strtotime($from . ' +' . $i . ' day'));
                $series[] = array(
                    'day' => $day,
                    'views' => isset($by_day[$day]) ? $by_day[$day]['views'] : 0,
                    'downloads' => isset($by_day[$day]) ? $by_day[$day]['downloads'] : 0,
                );
            }

            return new \WP_REST_Response(array(
                'range' => array('from' => $from, 'to' => $to, 'days' => $days),
                // The first day anything was ever counted. The chart clips to it: a range
                // that reaches back before the plugin was installed is not "nobody read
                // anything", it is "not measured yet", and zero-filling that stretch makes
                // a successful first week look like a failure. Matters most right after an
                // upgrade, when the default 30-day range is mostly older than the data.
                'firstDay' => Utils::pdfp_first_day($doc),
                'totals' => $totals,
                'previous' => array('views' => $previous['views'], 'downloads' => $previous['downloads']),
                'series' => $series,
                'docs' => $this->window_docs($from, $to, 20, $doc),
                'docCount' => $this->window_doc_count($from, $to, $doc),
                'doc' => $doc,
                'docTitle' => $doc ? $this->doc_title($doc) : null,
                'docEditUrl' => ($doc && Utils::pdfp_doc_post_id($doc))
                    ? get_edit_post_link(Utils::pdfp_doc_post_id($doc), 'raw')
                    : null,
                'docOrigin' => ($doc && !Utils::pdfp_doc_post_id($doc))
                    ? $this->origin_of($this->origin_for_doc($doc), $doc)
                    : array(),
                'allUrl' => admin_url('edit.php?post_type=pdfposter&page=pdf-poster-analytics'),
                'tracking' => Utils::pdfp_tracking_enabled(),
                'excludeEditors' => Utils::pdfp_excluding_editors(),
            ), 200);
        }

        /**
         * The same rows as summary(), as CSV text.
         *
         * Returned as a string for the browser to turn into a download, rather than as a
         * file response: it keeps this on the one dispatcher that already checks
         * capability, instead of adding a second endpoint that would have to re-check it.
         */
        public function export($data = array())
        {
            // The helper, not pdfp_fs() directly: it is the single definition of the tier
            // line, and one gate spelled two ways is a boundary nobody can audit.
            if (!Utils::pdfp_analytics_available()) {
                return new \WP_REST_Response(array('error' => 'pro_required'), 403);
            }

            list($from, $to, $days) = $this->resolve_range($data);
            $filter = $this->resolve_doc($data);

            $lines = array();
            $lines[] = $this->csv_row(array('Document', 'Document key', 'Views', 'Downloads', 'Download rate'));

            foreach ($this->window_docs($from, $to, 500, $filter) as $doc) {
                $lines[] = $this->csv_row(array(
                    $doc['title'],
                    $doc['doc'],
                    $doc['views'],
                    $doc['downloads'],
                    $doc['views'] > 0 ? round(($doc['downloads'] / $doc['views']) * 100, 1) . '%' : '',
                ));
            }

            return new \WP_REST_Response(array(
                'filename' => 'pdf-poster-insights-' . $from . '-to-' . $to . '.csv',
                'csv' => implode("\r\n", $lines),
            ), 200);
        }

        /** RFC4180-ish quoting: wrap everything, double any inner quote. */
        protected function csv_row($cells)
        {
            $out = array();
            foreach ($cells as $cell) {
                $out[] = '"' . str_replace('"', '""', (string) $cell) . '"';
            }
            return implode(',', $out);
        }

        /**
         * Turn the request into a concrete, sane date window.
         *
         * Clamped to 366 days so a hand-edited request cannot ask the database to group
         * ten years of rows for a chart that is 900px wide.
         */
        protected function resolve_range($data)
        {
            $today = current_time('Y-m-d');

            $from_raw = isset($data['from']) ? sanitize_text_field($data['from']) : '';
            $to_raw = isset($data['to']) ? sanitize_text_field($data['to']) : '';

            $valid = function ($value) {
                return (bool) preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) && strtotime($value);
            };

            if ($valid($from_raw) && $valid($to_raw)) {
                $from = $from_raw;
                $to = $to_raw;
                if (strtotime($from) > strtotime($to)) {
                    list($from, $to) = array($to, $from);
                }
            } else {
                // 1 = today. It runs through this same pipeline rather than a special
                // case: the previous period becomes yesterday, which is the comparison a
                // one-day view actually wants, and Chart.js already centres a lone point.
                $days = isset($data['days']) ? (int) $data['days'] : 30;
                if (!in_array($days, array(1, 7, 30, 90), true)) {
                    $days = 30;
                }
                $to = $today;
                $from = gmdate('Y-m-d', strtotime($to . ' -' . ($days - 1) . ' day'));
            }

            $span = (int) round((strtotime($to) - strtotime($from)) / DAY_IN_SECONDS) + 1;
            if ($span > 366) {
                $span = 366;
                $from = gmdate('Y-m-d', strtotime($to . ' -365 day'));
            }
            if ($span < 1) {
                $span = 1;
            }

            return array($from, $to, $span);
        }

        /**
         * Validate a document filter off the request.
         *
         * Runs through the same pdfp_is_doc_key() gate the write endpoint uses, so a
         * hand-edited `doc` param can only ever be a key this plugin issued.
         */
        protected function resolve_doc($data)
        {
            $doc = isset($data['doc']) ? sanitize_text_field($data['doc']) : '';
            return Utils::pdfp_is_doc_key($doc) ? $doc : '';
        }

        /**
         * Where an embed was last read, if we know and it still exists.
         *
         * Returns an empty array rather than a placeholder when the page has been deleted
         * or was never recorded -- the row then falls back to the hash alone, which is
         * honest, instead of linking somewhere broken.
         *
         * @param int $origin_post_id
         * @return array
         */
        protected function origin_of($origin_post_id, $doc = '')
        {
            $origin_post_id = (int) $origin_post_id;

            // Two sources, in this order: what tracking recorded, then what the content
            // actually says today. The recorded value can be blank (nothing viewed since
            // the column was added) or stale (the embed was moved), and the scan is the
            // one that reflects where the block lives now.
            $post = $origin_post_id > 0 ? get_post($origin_post_id) : null;

            if ((!$post || $post->post_status === 'trash') && $doc !== '') {
                $map = Utils::pdfp_embed_origin_map();
                if (isset($map[$doc])) {
                    $origin_post_id = (int) $map[$doc];
                    $post = get_post($origin_post_id);
                }
            }

            if (!$post || $post->post_status === 'trash') {
                return array();
            }

            $origin_post_id = (int) $post->ID;

            $title = $this->plain_title($post);

            return array(
                'id' => $origin_post_id,
                'title' => $title !== '' ? $title : __('(no title)', 'pdf-poster'),
                'type' => get_post_type_object($post->post_type)
                    ? get_post_type_object($post->post_type)->labels->singular_name
                    : $post->post_type,
                'editUrl' => (string) get_edit_post_link($origin_post_id, 'raw'),
                'viewUrl' => (string) get_permalink($origin_post_id),
            );
        }

        /**
         * A post title fit to hand to a JSON client.
         *
         * get_the_title() returns HTML-encoded text -- an en dash arrives as `&#8211;` --
         * and React escapes whatever it is given, so the entity would be printed
         * literally. Decoded here, once, rather than in three call sites.
         *
         * @param int|\WP_Post $post
         * @return string
         */
        protected function plain_title($post)
        {
            $title = get_the_title($post);

            return html_entity_decode((string) $title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        /** Human name for one document key. */
        protected function doc_title($doc)
        {
            $post_id = Utils::pdfp_doc_post_id($doc);
            $title = $post_id ? $this->plain_title($post_id) : '';

            if ($title !== '') {
                return $title;
            }

            return sprintf(
                /* translators: %s: short identifier for an ad-hoc embedded file */
                __('Embedded file · %s', 'pdf-poster'),
                substr((string) $doc, 2, 6)
            );
        }

        /** Summed counters across a window, optionally for one document. */
        protected function window_totals($from, $to, $doc = '')
        {
            global $wpdb;
            $table = Utils::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT SUM(views) AS views, SUM(downloads) AS downloads, SUM(prints) AS prints
                     FROM {$table} WHERE day BETWEEN %s AND %s" . ($doc ? " AND doc_id = %s" : ""),
                    $doc ? array($from, $to, $doc) : array($from, $to)
                ),
                ARRAY_A
            );

            return array(
                'views' => isset($row['views']) ? (int) $row['views'] : 0,
                'downloads' => isset($row['downloads']) ? (int) $row['downloads'] : 0,
                'prints' => isset($row['prints']) ? (int) $row['prints'] : 0,
            );
        }

        /** Ranked documents for a window, optionally narrowed to one. */
        protected function window_docs($from, $to, $limit = 20, $doc = '')
        {
            global $wpdb;
            $table = Utils::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT doc_id, MAX(post_id) AS post_id, MAX(origin_post_id) AS origin_post_id,
                            SUM(views) AS views, SUM(downloads) AS downloads
                     FROM {$table} WHERE day BETWEEN %s AND %s" . ($doc ? " AND doc_id = %s" : "") . "
                     GROUP BY doc_id ORDER BY views DESC, downloads DESC LIMIT %d",
                    $doc ? array($from, $to, $doc, (int) $limit) : array($from, $to, (int) $limit)
                ),
                ARRAY_A
            );

            $out = array();
            foreach ((array) $rows as $row) {
                $post_id = (int) $row['post_id'];
                $title = $post_id ? $this->plain_title($post_id) : '';
                $origin = array();

                if ($title === '') {
                    // A url-keyed embed: a block dropped straight onto a page, with no
                    // saved poster behind it. Only the hash of the URL is stored, never
                    // the URL, so the short hash is the only name available -- but the
                    // page it was read on is recorded, and that is the thing a reader
                    // actually wants to click.
                    $title = sprintf(
                        /* translators: %s: short identifier for an ad-hoc embedded file */
                        __('Embedded file · %s', 'pdf-poster'),
                        substr((string) $row['doc_id'], 2, 6)
                    );

                    $origin = $this->origin_of((int) $row['origin_post_id'], $row['doc_id']);
                }

                $out[] = array(
                    'doc' => $row['doc_id'],
                    'postId' => $post_id,
                    'title' => $title,
                    'editUrl' => $post_id ? get_edit_post_link($post_id, 'raw') : '',
                    'isEmbed' => $post_id === 0,
                    'origin' => $origin,
                    'views' => (int) $row['views'],
                    'downloads' => (int) $row['downloads'],
                );
            }

            return $out;
        }

        /** Most recent origin recorded for one document key. */
        protected function origin_for_doc($doc)
        {
            global $wpdb;
            $table = Utils::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            return (int) $wpdb->get_var(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT MAX(origin_post_id) FROM {$table} WHERE doc_id = %s",
                    $doc
                )
            );
        }

        /** How many distinct documents were touched in the window. */
        protected function window_doc_count($from, $to, $doc = '')
        {
            global $wpdb;
            $table = Utils::pdfp_stats_table();

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            return (int) $wpdb->get_var(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT COUNT(DISTINCT doc_id) FROM {$table} WHERE day BETWEEN %s AND %s" . ($doc ? " AND doc_id = %s" : ""),
                    $doc ? array($from, $to, $doc) : array($from, $to)
                )
            );
        }
    }
}
