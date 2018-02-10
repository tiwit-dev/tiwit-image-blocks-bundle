<?php
/**
 * Plugin Name: Tiwit image blocks bundle
 * Plugin URI: https://github.com/ahmadawais/create-guten-block/
 * Description: Image blocks bundle
 * Author: ArnaudBan
 * Author URI: https://arnaudban.me
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
