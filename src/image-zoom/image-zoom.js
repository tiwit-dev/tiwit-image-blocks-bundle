/**
 * BLOCK: wood-images-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;

const {
	createBlock,
	registerBlockType,
	MediaUpload,
	BlockControls,
	InspectorControls,
	PlainText,
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
		largeUrl: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: 'img',
		},
		fullUrl: {
			type: 'string',
			source: 'attribute',
			attribute: 'data-full-url',
			selector: 'img',
		},
		id: {
			type: 'number',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			attribute: 'alt',
			selector: 'img',
		},
		caption: {
			type: 'array',
			source: 'children',
			selector: 'figcaption',
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
							largeUrl: attributes.url,
							fullUrl: attributes.url,
							id: attributes.id,
							alt: attributes.alt
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
				transform: ( { fullUrl, id, alt } ) => {
					if ( id ) {
						return createBlock( 'core/image', {
							id: id,
							url: fullUrl,
							alt: alt
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

		let zoomElement = null

		const onSelectImage = img => {

			const largeUrl = img.sizes.large ? img.sizes.large.url : img.url

			let newAttributes = {
				id: img.id,
				largeUrl: largeUrl,
				fullUrl: img.url,
				alt: img.alt,
			}

			if( img.caption && img.caption != '' ){
				newAttributes.caption = img.caption
			}
			setAttributes( newAttributes );
		};

		const dispatchZoomUpdateEvent = function( trigger, fullUrl){

			const detail = {
				element : zoomElement,
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
			dispatchZoomUpdateEvent( trigger, attributes.fullUrl );
		};

		// Refresh zoom en every image change on load
		const imageLoaded = () => {
			dispatchZoomUpdateEvent( attributes.eventTrigger, attributes.fullUrl );
		}

		const eventTriggerValues = [
			{ value: 'mouseover', label: __( 'Mouse over' ) },
			{ value: 'grab', label: __( 'Grab' ) },
			{ value: 'click', label: __( 'Click' ) },
			{ value: 'toggle', label: __( 'Toggle' ) }
		]

		const eventTrigger = attributes.eventTrigger ? attributes.eventTrigger : 'mouseover'

		return (
				<figure className={ className }>
					{focus &&
						<BlockControls key="controls">
							<Toolbar>
								<MediaUpload
									onSelect={onSelectImage}
									type="image"
									value={attributes.id}
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
					{ ! attributes.id ? (

						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ attributes.id }
							render={ ( { open } ) => (
								<Button className="components-button components-icon-button button button-large" onClick={ open }>
									<span className="dashicons dashicons-format-image" />
									<span>{ __( 'Add image' ) }</span>
								</Button>
							) }
						/>

					) : (
						<React.Fragment>
							<img
								src={ attributes.largeUrl }
								alt={ attributes.alt }
								data-full-url={ attributes.fullUrl }
								data-event={ attributes.eventTrigger }
								onLoad={ imageLoaded }
								ref = { ( elem ) => { zoomElement = elem } }
							/>
							{ ( attributes.caption && attributes.caption.length > 0 ) || focus ? (
								<figcaption>
									<PlainText
										className="wp-caption"
										placeholder={ __( 'Write caption…' ) }
										value={ attributes.caption }
										onChange={ ( value ) => setAttributes( { caption: value } ) }
									/>
								</figcaption>
								) : null }
						</React.Fragment>
					)}

				</figure>
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
			<figure className={ className }>
				<img
					src={ attributes.largeUrl }
					alt={ attributes.alt }
					data-full-url={ attributes.fullUrl }
					data-event={ attributes.eventTrigger }
				/>
				{ attributes.caption && attributes.caption.length > 0 && <figcaption className="wp-caption">{ attributes.caption }</figcaption> }
			</figure>
		);
	},
} );
