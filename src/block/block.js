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
	registerBlockType,
	MediaUpload,
	BlockControls,
	BlockAlignmentToolbar,
} = wp.blocks;

const {
	Button,
	IconButton,
	Toolbar
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
	edit: props => {
		const { className, attributes, setAttributes, focus } = props

		const onSelectImage = img => {

			setAttributes( {
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt,
			} );
		};

		const imageZoomLoad = () => {

			const event = new Event('tiwit-add-zoom-image' );
			document.dispatchEvent( event );
		}

		const updateAlignment = alignment => {

			setAttributes( {
				alignment: alignment,
			} );
		}

		return (
				<div className={ className }>
					{ focus &&
						<BlockControls key="controls">
							<BlockAlignmentToolbar
								value={ attributes.alignment }
								onChange={ updateAlignment }
							/>
							<Toolbar>
								<MediaUpload
									onSelect={ onSelectImage }
									type="image"
									value={ attributes.imgID }
									render={ ( { open } ) => (
										<IconButton
											onClick={ open }
											className="components-toolbar__control"
											label={ __( 'Edit image' ) }
											icon="edit"
										/>
									) }
								/>
							</Toolbar>

						</BlockControls>
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
							onLoad={ imageZoomLoad }
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
					data-full-url={ attributes.imgURL }
				/>
			</div>
		);
	},
} );
