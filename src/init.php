<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package TIBB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */

add_action( 'enqueue_block_assets', 'tiwit_image_blocks_bundle_assets' );

function tiwit_image_blocks_bundle_assets() {

	// Styles
	wp_enqueue_style(
		'tiwit_images_blocks-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
	wp_enqueue_style('tiwit-juxtapose-css', 'https://cdn.knightlab.com/libs/juxtapose/latest/css/juxtapose.css', array(), '1.2.0');

	// Script
	wp_enqueue_script( 'tiwit-juxtapose', 'https://cdn.knightlab.com/libs/juxtapose/latest/js/juxtapose.min.js', array(), '1.2.0', true );

	// Image zoom
	wp_enqueue_script( 'tiwit-jquery-zoom', plugins_url( 'src/libs/jquery.zoom.min.js', dirname( __FILE__ ) ), array( 'jquery' ), '1.7.20', true );
	wp_enqueue_script( 'tiwit-images-zoom', plugins_url( 'src/image-zoom/images-zoom-scripts.js', dirname( __FILE__ ) ), array( 'tiwit-jquery-zoom' ), '1.0', true );
}


add_action( 'enqueue_block_editor_assets', 'tiwit_images_blocks_cgb_editor_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function tiwit_images_blocks_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'tiwit_images_blocks-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'tiwit-juxtapose' ) // Dependencies, defined above.
		// filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ) // Version: filemtime — Gets file modification time.
	);

	// Styles.
	wp_enqueue_style(
		'tiwit_images_blocks-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function tiwit_images_blocks_cgb_editor_assets().

// Hook: Editor assets.
