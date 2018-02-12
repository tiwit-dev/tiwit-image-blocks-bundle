jQuery( function( $ ){

	const imageZoom = function(){

		$('.wp-block-tiwit-images-bundle-images-zoom').each( function ( index, element ) {
			$( element ).zoom(
				{
					url: element.firstChild.dataset.fullUrl
				});
		})
	};
	imageZoom();


	document.addEventListener( 'tiwit-add-zoom-image', imageZoom );
});
