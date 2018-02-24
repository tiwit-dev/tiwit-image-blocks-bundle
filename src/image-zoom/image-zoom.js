/**
 * BLOCK: wood-images-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

const { __ } = wp.i18n;

const {
	createBlock,
	registerBlockType,
	MediaUpload,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.blocks;

const {
	Button,
	IconButton,
	Toolbar,
	SelectControl,
} = wp.components;


/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'tiwit-images-bundle/images-zoom', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Images Zoom' ), // Block title.
	description: __('Image with a zoom'),
	icon: 'welcome-view-site', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	supports: {
		html: false
	},
	attributes: {
		imgURL: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: 'img',
		},
		imgID: {
			type: 'number',
		},
		imgAlt: {
			type: 'string',
			source: 'attribute',
			attribute: 'alt',
			selector: 'img',
		},
		alignment : {
			type: 'string'
		},
		eventTrigger :{
			type: 'string',
		}
	},
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: false,
				blocks: [ 'core/image' ],
				transform: ( attributes ) => {
					if ( attributes.id  ) {
						return createBlock( 'tiwit-images-bundle/images-zoom', {
							imgURL: attributes.url,
							imgID: attributes.id,
							imgAlt: attributes.alt
						} );
					}
					return createBlock( 'tiwit-images-bundle/images-zoom' );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { imgURL, imgID, imgAlt } ) => {
					if ( imgID ) {
						return createBlock( 'core/image', {
							id: imgID,
							url: imgURL,
							alt: imgAlt
						} );
					}
					return createBlock( 'core/image' );
				},
			},
		]
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: props => {

		const { className, attributes, setAttributes, focus } = props

		let zoomWrapperElement = null;

		const onSelectImage = img => {

			setAttributes( {
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt,
			} );
		};

		const dispatchZoomUpdateEvent = function( trigger, fullUrl){

			const detail = {
				element : zoomWrapperElement,
				trigger : trigger,
				fullUrl: fullUrl,
			}
			const customEvent = new CustomEvent('tiwit-add-zoom-image', { 'detail' : detail } );
			document.dispatchEvent( customEvent );
		}

		const onZoomTriggerChange = trigger => {
			setAttributes( {
				eventTrigger: trigger
			} );
			dispatchZoomUpdateEvent( trigger, attributes.imgURL );
		};

		// Refresh zoom en every image change on load
		const imageLoaded = () => {
			dispatchZoomUpdateEvent( attributes.eventTrigger, attributes.imgURL );
		}

		const eventTriggerValues = [
			{ value: 'mouseover', label: __( 'Mouse over' ) },
			{ value: 'grab', label: __( 'Grab' ) },
			{ value: 'click', label: __( 'Click' ) },
			{ value: 'toggle', label: __( 'Toggle' ) }
		]

		const eventTrigger = attributes.eventTrigger ? attributes.eventTrigger : 'mouseover'

		return (
				<div className={ className }
					ref = { ( elem ) => { zoomWrapperElement = elem } }>
					{focus &&
						<BlockControls key="controls">
							<BlockAlignmentToolbar
								value={attributes.alignment}
								onChange={ ( alignment ) =>  setAttributes( { alignment : alignment } ) }
							/>
							<Toolbar>
								<MediaUpload
									onSelect={onSelectImage}
									type="image"
									value={attributes.imgID}
									render={({open}) => (
										<IconButton
											onClick={open}
											className="components-toolbar__control"
											label={__('Edit image')}
											icon="edit"
										/>
									)}
								/>
							</Toolbar>

						</BlockControls>
					}
					{ focus &&
						<InspectorControls key="inspector">
							<h2>{ __( 'Image Settings' ) }</h2>
							<SelectControl
								label={ __( 'Event trigger' ) }
								value={ eventTrigger }
								options={ eventTriggerValues }
								onChange={ onZoomTriggerChange }
							/>
						</InspectorControls>
					}
					{ ! attributes.imgID ? (

						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ attributes.imgID }
							render={ ( { open } ) => (
								<Button className="components-button components-icon-button button button-large" onClick={ open }>
									<span className="dashicons dashicons-format-image" />
									<span>{ __( 'Add image' ) }</span>
								</Button>
							) }
						/>

					) : (

						<img
							src={ attributes.imgURL }
							alt={ attributes.imgAlt }
							data-full-url={ attributes.imgURL }
							data-event={ attributes.eventTrigger }
							onLoad={ imageLoaded }
						/>
					)}

				</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save( { className, attributes } ) {
		return (
			<div className={ className }>
				<img
					src={ attributes.imgURL }
					alt={ attributes.imgAlt }
					data-event={ attributes.eventTrigger }
					data-full-url={ attributes.imgURL }
				/>
			</div>
		);
	},
} );
