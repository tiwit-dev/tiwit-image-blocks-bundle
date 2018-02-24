jQuery( function( $ ){

	const doImageZoom = function( element, trigger, fullUrl ){

		// destroy all zoom
		$( element ).trigger('zoom.destroy');

		const event = trigger ? trigger : 'mouseover';

		// Set zoom
		$( element ).zoom(
			{
				url: fullUrl,
				on: event
			});
	}

	// Do zoom on page load
	$('.wp-block-tiwit-images-bundle-images-zoom').each( function ( index, element ) {

		doImageZoom( element, element.firstChild.dataset.event, element.firstChild.dataset.fullUrl );
	})

	// Do zoom on custom event
	document.addEventListener( 'tiwit-add-zoom-image', function( event ){

		const detail = event.detail;
		doImageZoom( detail.element, detail.trigger, detail.fullUrl );
	} );
});
