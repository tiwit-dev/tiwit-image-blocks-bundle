jQuery(function( $ ){

	const tiwitDoTwentyTwenty = function( element ){

		$( element ).twentytwenty({
			before_label: element.dataset.beforeLabel,
			after_label: element.dataset.afterLabel
		});
	}

	// Do the comparison on load
	const $imageComparaisonBlock = $(".wp-block-tiwit-images-bundle-images-comparison.twentytwenty-container");
	if( $imageComparaisonBlock.length > 0 ){

		$imageComparaisonBlock.imagesLoaded()
			.done( function( instance ){
				instance.elements.map( function( element ){
					tiwitDoTwentyTwenty( element );
				})
			} );
	}

	// Do the comparison on custom event
	document.addEventListener( 'tiwit-do-images-comparison', function( event ){

		const element = event.detail.element;
		tiwitDoTwentyTwenty( element );
	} );
});
