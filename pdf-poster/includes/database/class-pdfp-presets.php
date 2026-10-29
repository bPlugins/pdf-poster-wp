<?php

namespace PDFPro\Database;

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'PDFPro\Database\PDFP_Presets' ) ) {
    class PDFP_Presets
{
    protected $table;
    protected $version = 8;
    protected $name = 'pdfposter_presets';

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
     * Add videos table
     * This is used for global video analytics
     *
     * @return void
     */
    public function install()
    {
        return $this->table->create($this->name, "
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name VARCHAR(256) NOT NULL,
            preset text NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
            PRIMARY KEY (`id`)
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

$pdfp_presets_obj = new PDFP_Presets(new PDFP_Table());
$pdfp_presets_obj->install();

}