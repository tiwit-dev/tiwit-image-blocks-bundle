jQuery( function( $ ){

	const doImageZoom = function( element, trigger, fullUrl ){

		// destroy all zoom
		const parent = $( element ).parent();

		if( parent[0].classList.contains('tiwit-image-zoom-wrapper') ){
			parent.trigger('zoom.destroy');
		} else {
			$( element ).wrap('<span class="tiwit-image-zoom-wrapper" style="display:inline-block" />');
		}

		const event = trigger ? trigger : 'mouseover';

		// Set zoom
		$( element )
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
