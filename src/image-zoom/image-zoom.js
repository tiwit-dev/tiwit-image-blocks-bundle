/**
 * BLOCK: image-zoom
 *
 * Add the possibility to zoom in the image
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;

const { Component } = wp.element

const {
	createBlock,
	registerBlockType,
	MediaUpload,
	BlockControls,
	InspectorControls,
	ImagePlaceholder,
	RichText,
} = wp.blocks;

const {
	IconButton,
	Toolbar,
	SelectControl,
} = wp.components;



class TiwitImagesZoom extends Component {

	constructor() {
		super( ...arguments );

		this.onFocusCaption = this.onFocusCaption.bind( this );
		this.onImageClick = this.onImageClick.bind( this );
		this.imageLoaded = this.imageLoaded.bind( this );
		this.onFocusCaption = this.onFocusCaption.bind( this );
		this.onZoomTriggerChange = this.onZoomTriggerChange.bind( this );
		this.dispatchZoomUpdateEvent = this.dispatchZoomUpdateEvent.bind( this );
		this.onSelectImage = this.onSelectImage.bind( this );

		this.state = {
			captionFocused: false,
		};
	}


	componentWillReceiveProps( { isSelected } ) {
		if ( ! isSelected && this.props.isSelected && this.state.captionFocused ) {
			this.setState( {
				captionFocused: false,
			} );
		}
	}

	onImageClick( event ) {
		if ( this.zoomElement && event.target.parentElement === this.zoomElement.parentElement && this.state.captionFocused ) {
			this.setState( {
				captionFocused: false,
			} );
		}
	}

	onFocusCaption() {
		if ( ! this.state.captionFocused ) {
			this.setState( {
				captionFocused: true,
			} );
		}
	}

	dispatchZoomUpdateEvent( trigger, fullUrl){

		const detail = {
			element : this.zoomElement,
			trigger : trigger,
			fullUrl: fullUrl,
		}
		const customEvent = new CustomEvent('tiwit-add-zoom-image', { 'detail' : detail } );
		document.dispatchEvent( customEvent );
	}

	onZoomTriggerChange( trigger ) {
		this.props.setAttributes( {
			eventTrigger: trigger
		} );
		this.dispatchZoomUpdateEvent( trigger, this.props.attributes.fullUrl );
	};

	// Refresh zoom en every image change on load
	imageLoaded(){
		this.dispatchZoomUpdateEvent( this.props.attributes.eventTrigger, this.props.attributes.fullUrl );
	}

	onSelectImage ( img ) {

		const largeUrl = img.sizes && img.sizes.large ? img.sizes.large.url : img.url

		let newAttributes = {
			id: img.id,
			largeUrl: largeUrl,
			fullUrl: img.url,
			alt: img.alt,
		}

		if( img.caption && img.caption !== '' ){
			newAttributes.caption = img.caption
		}
		this.props.setAttributes( newAttributes );
	};


	render(){

		const { className, attributes, setAttributes, focus, isSelected } = this.props

		const eventTriggerValues = [
			{ value: 'mouseover', label: __( 'Mouse over' ) },
			{ value: 'grab', label: __( 'Grab' ) },
			{ value: 'click', label: __( 'Click' ) },
			{ value: 'toggle', label: __( 'Toggle' ) }
		]

		const eventTrigger = attributes.eventTrigger ? attributes.eventTrigger : 'mouseover'

		return (
			<figure className={ className } onClick={ this.onImageClick }>
				{focus &&
				<BlockControls key="controls">
					<Toolbar>
						<MediaUpload
							onSelect={this.onSelectImage}
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
						onChange={ this.onZoomTriggerChange }
					/>
				</InspectorControls>
				}
				{ ! attributes.id ? (

					<ImagePlaceholder
						className={ className }
						key="image-placeholder"
						icon="format-image"
						label={ __( 'Image' ) }
						onSelectImage={ this.onSelectImage }
					/>

				) : (
					<React.Fragment>
						<img
							src={ attributes.largeUrl }
							alt={ attributes.alt }
							data-full-url={ attributes.fullUrl }
							data-event={ attributes.eventTrigger }
							onLoad={ this.imageLoaded }
							ref = { ( elem ) => { this.zoomElement = elem } }
						/>
						{ ( attributes.caption && attributes.caption.length > 0 ) || isSelected ? (
							<RichText
								className="wp-caption"
								tagName="figcaption"
								placeholder={ __( 'Write caption…' ) }
								value={ attributes.caption }
								onFocus={ this.onFocusCaption }
								onChange={ ( value ) => setAttributes( { caption: value } ) }
								isSelected={ this.state.captionFocused }
								inlineToolbar
							/>
						) : null }
					</React.Fragment>
				)}

			</figure>
		);
	}
}

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
	edit: TiwitImagesZoom,

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
