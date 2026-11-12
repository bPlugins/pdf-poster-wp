<?php
if ( ! defined( 'ABSPATH' ) ) exit; 

if(isset($attributes['selected'])){
    echo do_shortcode("[pdf id=".esc_attr($attributes['selected'])."]");
}else if(isset($attributes['data']['tringle_text'])){
    echo do_shortcode("[pdf id=".esc_attr($attributes['data']['tringle_text'])."]");
}