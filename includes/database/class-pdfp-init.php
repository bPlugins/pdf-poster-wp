<?php

namespace PDFPro\Database;

use PDFPro\Database\PDFP_Table;

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'PDFPro\Database\PDFP_Init' ) ) {
    class PDFP_Init
{

    public static function get_tables()
    {
        return [
            PDFP_Presets::class,
            PDFP_Analytics::class,
        ];
    }

    public function register() {
        foreach (self::get_tables() as $class) {
            $table = self::instantiate($class);
            if (method_exists($table, 'install')) {
                $table->install();
            }
        }
    }

    public static function drop()
    {
        foreach (self::get_tables() as $class) {
            $table = self::instantiate($class);
            if (method_exists($table, 'uninstall')) {
                $table->uninstall();
            }
        }
        return true;
    }


    private static function instantiate($class)
    {
        return new $class(new PDFP_Table);
    }
}

}