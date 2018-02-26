jQuery(function( $ ){
	$(".wp-block-tiwit-images-bundle-images-comparison.twentytwenty-container").imagesLoaded( function( instance ){
		$(instance.elements).twentytwenty();
	} );

	document.addEventListener( 'tiwit-do-images-comparison', function( event ){

		const element = event.detail.element;
		$(element).twentytwenty();
	} );
});
