jQuery( function( $ ){

	const imageZoom = function(){

		$('.wp-block-tiwit-images-bundle-images-zoom').each( function ( index, element ) {
			// destroy all zoom
			$( element ).trigger('zoom.destroy');

			// Set zoom
			$( element ).zoom(
				{
					url: element.firstChild.dataset.fullUrl
				});
		})
	};
	imageZoom();


	document.addEventListener( 'tiwit-add-zoom-image', imageZoom );
});
