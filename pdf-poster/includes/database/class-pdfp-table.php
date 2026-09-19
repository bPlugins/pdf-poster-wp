<?php

namespace PDFPro\Database;

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'PDFPro\Database\PDFP_Table' ) ) {
    class PDFP_Table {
    /**
     * Create a database table
     *
     * @param string $name
     * @param string $columns
     * @param integer $version
     * @param array $opts
     * @return void
     */
    public function create($name, $columns, $version = 1, $opts = []) {
        $current_version = get_option("{$name}_database_version", 0);

        if ($version == $current_version) {
            return;
        }

        global $wpdb;

        $name = sanitize_key($name);
        $full_table_name = $wpdb->prefix . $name;

        $opts = wp_parse_args($opts, [
            'upgrade_method' => 'dbDelta',
            'table_options' => '',
        ]);

        $charset_collate = '';
        if ($wpdb->has_cap('collation')) {
            if (!empty($wpdb->charset)) {
                $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
            }
            if (!empty($wpdb->collate)) {
                $charset_collate .= " COLLATE $wpdb->collate";
            }
        }

        $table_options = $charset_collate . ' ' . $opts['table_options'];

        // use dbDelta by default
        if ('dbDelta' == $opts['upgrade_method']) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
            // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, PluginCheck.Security.DirectDB.UnescapedDBParameter
            dbDelta("CREATE TABLE " . esc_sql($full_table_name) . " ( $columns ) $table_options");
            update_option("{$name}_database_version", $version);
            return;
        }

        if ('delete_first' == $opts['upgrade_method']) {
            // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, PluginCheck.Security.DirectDB.UnescapedDBParameter
            $wpdb->query("DROP TABLE IF EXISTS " . esc_sql($full_table_name) . ";");
        }

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, PluginCheck.Security.DirectDB.UnescapedDBParameter
        $wpdb->query("CREATE TABLE IF NOT EXISTS " . esc_sql($full_table_name) . " ( $columns ) $table_options;");


        update_option("{$name}_database_version", $version);
    }

    /**
     * Drops the table and database option
     *
     * @param string $name
     * @return void
     */
    public function drop($name) {
        global $wpdb;
        $name = sanitize_key($name);
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange, PluginCheck.Security.DirectDB.UnescapedDBParameter
        $wpdb->query("DROP TABLE IF EXISTS " . esc_sql($wpdb->prefix . $name));
        // delete_option("{$name}_database_version");
    }
}

}