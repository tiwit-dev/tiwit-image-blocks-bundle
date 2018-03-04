<?php
/**
 * Plugin Name: TiwiT image blocks bundle
 * Plugin URI: https://tiwit.io
 * Description: Image blocks bundle
 * Author: TiwiT
 * Author URI: https://tiwit.io
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
