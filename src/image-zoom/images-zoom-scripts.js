jQuery( function( $ ){

	const doImageZoom = function( element, trigger, fullUrl ){

		// destroy all zoom
		$( element ).trigger('zoom.destroy');

		const event = trigger ? trigger : 'mouseover';

		// Set zoom
		$( element )
			.wrap('<span style="display:inline-block" />')
			.parent()
			.zoom({
				url: fullUrl,
				on: event
			});
	}

	// Do zoom on page load
	$('.wp-block-tiwit-images-bundle-images-zoom img').each( function ( index, element ) {

		doImageZoom( element, element.dataset.event, element.dataset.fullUrl );
	})

	// Do zoom on custom event
	document.addEventListener( 'tiwit-add-zoom-image', function( event ){

		const detail = event.detail;
		doImageZoom( detail.element, detail.trigger, detail.fullUrl );
	} );
});
