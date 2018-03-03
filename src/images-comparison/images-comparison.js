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
	TextControl,
	SelectControl,
	CheckboxControl
} = wp.components


class ImagesComparison extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			juxtapose: null
		}

		this.createSliderFromAttributes = this.createSliderFromAttributes.bind( this )
		this.changeShowLabelsCheckbox = this.changeShowLabelsCheckbox.bind( this )
	}

	componentDidMount(){

		const { attributes, setAttributes } = this.props

		// Default attributs
		const defaultAttributes = {}
		if( ! attributes.beforeLabel ){
			defaultAttributes.beforeLabel = __('Before')
		}
		if( ! attributes.afterLabel ){
			defaultAttributes.afterLabel = __('After')
		}
		if( ! attributes.orientation ){
			defaultAttributes.orientation = 'horizontal'
		}
		if( ! attributes.showLabels ){
			defaultAttributes.showLabels = 'true'
		}

		if( defaultAttributes ){
			setAttributes( defaultAttributes )
		}

		if( attributes.firstImageUrl && attributes.secondImageUrl ){

			this.createSliderFromAttributes();

		}
	}

	createSliderFromAttributes() {

		// Delete everything and rebuild
		while (this.comparisonElement.firstChild) {
			this.comparisonElement.removeChild(this.comparisonElement.firstChild);
		}

		const images = [
			{
				src: this.props.attributes.firstImageUrl,
				label: this.props.attributes.beforeLabel
			},
			{
				src: this.props.attributes.secondImageUrl,
				label: this.props.attributes.afterLabel,
			}
		]
		const opts = {
			animate: true,
			showLabels: this.props.attributes.showLabels,
			startingPosition: "50%",
			makeResponsive: true,
			mode: this.props.attributes.orientation
		}

		window.slider_preview = new juxtapose.JXSlider(".tiwit-" + this.props.id, images, opts);
	}


	componentDidUpdate( prevProps ){

		// Check if wee have two images and if one has change
		if( this.props.attributes.firstImageUrl && this.props.attributes.secondImageUrl &&
			(
				this.props.attributes.firstImageUrl !== prevProps.attributes.firstImageUrl ||
				this.props.attributes.secondImageUrl !== prevProps.attributes.secondImageUrl ||
				this.props.attributes.orientation !== prevProps.attributes.orientation ||
				this.props.attributes.beforeLabel !== prevProps.attributes.beforeLabel ||
				this.props.attributes.afterLabel !== prevProps.attributes.afterLabel ||
				this.props.attributes.showLabels !== prevProps.attributes.showLabels
			)
		){

			this.createSliderFromAttributes();

		}
	}

	onSelectImage( selectedImage, witchImage ){
		const { setAttributes } = this.props;

		let newAttributes = {}
		newAttributes[ witchImage + 'ImageId' ] = selectedImage.id
		newAttributes[ witchImage + 'ImageUrl' ] = selectedImage.url

		setAttributes( newAttributes )
	}

	changeShowLabelsCheckbox( checked )
	{
		console.log( checked );
		this.props.setAttributes({ showLabels: checked ? 'true' : 'false' })
	}

	render() {
		const { id, className, attributes, focus, setAttributes } = this.props
		const {  firstImageId, secondImageId, firstImageUrl, secondImageUrl } = attributes
		const classNameFull = firstImageId && secondImageId ? className + ' juxtapose' : className;


		return(

			<div
				className={classNameFull + ' tiwit-' + id}
				ref={ (element) => { this.comparisonElement = element }}
			>
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
							value={ attributes.beforeLabel }
							onChange={ ( text ) => setAttributes({ beforeLabel: text }) }
						/>
						<TextControl
							label={ __( 'After label' ) }
							value={ attributes.afterLabel }
							onChange={ ( text ) => setAttributes({ afterLabel: text }) }
						/>
						<SelectControl
							label={ __( 'Orientation' ) }
							value={ attributes.orientation }
							options={ [
								{ value: 'horizontal', label: __( 'Horizontal' ) },
								{ value: 'vertical', label: __( 'Vertical' ) }
							] }
							onChange={ ( orientation ) => setAttributes({ orientation: orientation }) }
						/>
						<CheckboxControl
							label= {__( 'Show labels' )}
							checked={ attributes.showLabels === 'true' }
							onChange={ this.changeShowLabelsCheckbox }
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
		orientation:{
			source: 'attribute',
			attribute: 'data-mode',
			selector: '.wp-block-tiwit-images-bundle-images-comparison',
		},
		showLabels:{
			source: 'attribute',
			attribute: 'data-showlabels',
			selector: '.wp-block-tiwit-images-bundle-images-comparison',
		},
		beforeLabel:{
			source: 'attribute',
			attribute: 'data-label',
			selector: 'img.first-image',
		},
		afterLabel:{
			source: 'attribute',
			attribute: 'data-label',
			selector: 'img.second-image',
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
	save( { className, attributes, id } ) {

		const beforeLabel = attributes.beforeLabel ? attributes.beforeLabel : __('Before')
		const afterLabel = attributes.afterLabel ? attributes.afterLabel : __('After')
		const orientation = attributes.orientation ? attributes.orientation : 'horizontal'
		const showLabels = attributes.showLabels ? attributes.showLabels : 'true'

		return (
			<div
				className={className + ' juxtapose tiwit-' + id}
				data-mode={orientation}
				data-showlabels={showLabels}
			>
				<img src={attributes.firstImageUrl} className="first-image" data-label={beforeLabel} />
				<img src={attributes.secondImageUrl} className="second-image" data-label={afterLabel}/>
			</div>
		);
	},
} );
