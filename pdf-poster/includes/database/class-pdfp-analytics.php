<?php

namespace PDFPro\Database;

if (!defined('ABSPATH'))
    exit;

if (!class_exists('PDFPro\Database\PDFP_Analytics')) {
    /**
     * Document Insights storage.
     *
     * ONE row per document per day, upserted on the (doc_id, day) unique key. That is
     * deliberate: an aggregate row is the permanent record, it is tiny (~365 rows a year
     * for a document that is read every day), and an UPSERT can never lose an increment
     * to a race the way a read-modify-write can.
     *
     * `origin_post_id` is the page or post an embed was most recently read on. It only
     * matters for url-keyed documents (`u:<sha1>`): a saved poster names itself, but a
     * block dropped onto a page has no name to show and no way to be found again, so
     * without this the report could only ever call it "Embedded file · a1b2c3". It is the
     * LAST origin, not a list -- one document can be embedded in several places, and a
     * full mapping is a different table than this one.
     *
     * `last_seen` is the one non-aggregate value kept: `day` alone is a DATE, so a
     * document read two minutes ago reported as "13 hours ago" (the distance to
     * midnight). It is a single timestamp per document per day, not a visitor record.
     *
     * The Pro-only per-event table (`pdfposter_events`) is NOT created here. v2.6.0
     * stores aggregates only, so the free build holds no per-visitor row anywhere --
     * which is what keeps its privacy story a single sentence. The depth/dwell/completion
     * columns below are created up front so the Pro release that starts writing them
     * needs no schema migration.
     */
    class PDFP_Analytics
    {
        protected $table;
        protected $version = 3;
        protected $name = 'pdfposter_stats';

        public function __construct(PDFP_Table $table)
        {
            $this->table = $table;
        }

        public function getName()
        {
            global $wpdb;
            return $wpdb->prefix . $this->name;
        }

        /**
         * Create the daily rollup table.
         *
         * @return void
         */
        public function install()
        {
            return $this->table->create($this->name, "
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            doc_id VARCHAR(64) NOT NULL,
            post_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            day DATE NOT NULL,
            views INT UNSIGNED NOT NULL DEFAULT 0,
            unique_views INT UNSIGNED NOT NULL DEFAULT 0,
            downloads INT UNSIGNED NOT NULL DEFAULT 0,
            prints INT UNSIGNED NOT NULL DEFAULT 0,
            fullscreens INT UNSIGNED NOT NULL DEFAULT 0,
            shares INT UNSIGNED NOT NULL DEFAULT 0,
            completions INT UNSIGNED NOT NULL DEFAULT 0,
            depth_sum INT UNSIGNED NOT NULL DEFAULT 0,
            dwell_ms BIGINT UNSIGNED NOT NULL DEFAULT 0,
            last_seen DATETIME NULL DEFAULT NULL,
            origin_post_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            PRIMARY KEY  (id),
            UNIQUE KEY doc_day (doc_id, day),
            KEY post_day (post_id, day)
            ", $this->version);
        }

        /**
         * Uninstall tables
         *
         * @return void
         */
        public function uninstall()
        {
            $this->table->drop($this->getName());
        }
    }
}
