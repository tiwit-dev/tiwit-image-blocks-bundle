/**
 * BLOCK: image-comparison
 *
 * Compare two image
 */

//  Import CSS.
import './style.scss';

const { __ } = wp.i18n;

const { Component } = wp.element

const {
	ImagePlaceholder,
	registerBlockType,
	BlockControls,
	InspectorControls,
	MediaUpload
} = wp.blocks

const {
	Dashicon,
	Button,
	Toolbar,
	TextControl
} = wp.components


class ImagesComparison extends Component {


	componentDidUpdate( prevProps ){

		// Check if wee have two images and if one has change
		if( this.props.attributes.firstImageUrl && this.props.attributes.secondImageUrl &&
			(
				this.props.attributes.firstImageUrl !== prevProps.attributes.firstImageUrl ||
				this.props.attributes.secondImageUrl !== prevProps.attributes.secondImageUrl ||
				this.props.attributes.beforeLabel !== prevProps.attributes.beforeLabel ||
				this.props.attributes.afterLabel !== prevProps.attributes.afterLabel
			)
		){

			const detail = {
				element : this.comparisonElement,
			}
			const customEvent = new CustomEvent('tiwit-do-images-comparison', { 'detail' : detail } );
			document.dispatchEvent( customEvent );
		}
	}

	onSelectImage( selectedImage, witchImage ){
		const { setAttributes } = this.props;

		let newAttributes = {}
		newAttributes[ witchImage + 'ImageId' ] = selectedImage.id
		newAttributes[ witchImage + 'ImageUrl' ] = selectedImage.url

		setAttributes( newAttributes )
	}

	render() {
		const { className, attributes, focus, setAttributes } = this.props
		const {  firstImageId, secondImageId, firstImageUrl, secondImageUrl } = attributes
		const classNameFull = firstImageId && secondImageId ? className + ' twentytwenty-container' : className;

		const beforeLabel = attributes.beforeLabel ? attributes.beforeLabel : __('Before')
		const afterLabel = attributes.afterLabel ? attributes.afterLabel : __('After')

		return(

			<div className={classNameFull}
				 ref={ (element) => { this.comparisonElement = element }}
				 data-before-label={beforeLabel}
				 data-after-label={afterLabel}>
				{focus &&
					<BlockControls key="controls">
						<Toolbar>
							<MediaUpload
								onSelect={ (image ) => this.onSelectImage( image, 'first' ) }
								type="image"
								value={attributes.firstImageId}
								render={({open}) => (
									<Button className={"components-icon-button " + className + "-button" } onClick={open} >
										<Dashicon icon="edit"/>
										<span>{__('Edit first image')}</span>
									</Button>
								)}
							/>
							<MediaUpload
								onSelect={ (image ) => this.onSelectImage( image, 'second' ) }
								type="image"
								value={attributes.secondImageId}
								render={({open}) => (
									<Button className={"components-icon-button " + className + "-button" } onClick={open} >
										<Dashicon icon="edit"/>
										<span>{__('Edit second image')}</span>
									</Button>
								)}
							/>
						</Toolbar>

					</BlockControls>
				}
				{ focus &&
					<InspectorControls key="inspector">
						<h2>{ __( 'Comparison Settings' ) }</h2>
						<TextControl
							label={ __( 'Before label' ) }
							value={ beforeLabel }
							onChange={ ( text ) => setAttributes({ beforeLabel: text }) }
						/>
						<TextControl
							label={ __( 'After label' ) }
							value={ afterLabel }
							onChange={ ( text ) => setAttributes({ afterLabel: text }) }
						/>

					</InspectorControls>
				}
				{ ! firstImageId ?
					<ImagePlaceholder
						key="first-image-placeholder"
						icon="format-image"
						label={ __( 'First image' ) }
						onSelectImage={ ( image ) => this.onSelectImage( image, 'first' ) }
					/>
					 :
					<img src={firstImageUrl} className="first-image"/>

				}{ ! secondImageId ?
					<ImagePlaceholder
						key="second-image-placeholder"
						icon="format-image"
						label={ __( 'Second image' ) }
						onSelectImage={ ( image ) => this.onSelectImage( image, 'second' ) }
					/>
					 :
					<img src={secondImageUrl} className="second-image"/>

				}
			</div>
		)
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
registerBlockType( 'tiwit-images-bundle/images-comparison', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Images comparison' ), // Block title.
	description: __('Compare two images'),
	icon: 'welcome-view-site', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	supports: {
		html: false
	},
	attributes: {
		firstImageId:{
			type: 'number'
		},
		secondImageId:{
			type: 'number'
		},
		beforeLabel:{
			source: 'attribute',
			attribute: 'data-before-label',
			selector: '.wp-block-tiwit-images-bundle-images-comparison',
		},
		afterLabel:{
			source: 'attribute',
			attribute: 'data-after-label',
			selector: '.wp-block-tiwit-images-bundle-images-comparison',
		},
		firstImageUrl:{
			source: 'attribute',
			attribute: 'src',
			selector: 'img.first-image',
		},
		secondImageUrl:{
			source: 'attribute',
			attribute: 'src',
			selector: 'img.second-image',
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: ImagesComparison,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save( { className, attributes } ) {

		const beforeLabel = attributes.beforeLabel ? attributes.beforeLabel : __('Before')
		const afterLabel = attributes.afterLabel ? attributes.afterLabel : __('After')

		return (
			<div className={className + ' twentytwenty-container'} data-before-label={beforeLabel} data-after-label={afterLabel}>
				<img src={attributes.firstImageUrl} className="first-image" />
				<img src={attributes.secondImageUrl} className="second-image"/>
			</div>
		);
	},
} );
