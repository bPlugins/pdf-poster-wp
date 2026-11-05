<?php
if ( ! defined( 'ABSPATH' ) ) exit;

$pdfp_required_files = [
    'includes/helper/functions.php',
    'includes/admin/class-pdfp-admin.php', 
    'includes/base/class-pdfp-registerblock.php',
    'includes/base/class-pdfp-licenseactivation.php',
];

foreach ($pdfp_required_files as $pdfp_file) {
    if(file_exists(PDFPRO_PATH . $pdfp_file)) {
        require_once(PDFPRO_PATH . $pdfp_file);
    }
}
