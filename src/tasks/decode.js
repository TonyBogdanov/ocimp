import { is, runFrontend } from 'worker-relay';
import support from '../support';
import createCanvas from '../util/create-canvas';

const blobToImage = blob => new Promise( ( resolve, reject ) => {

    if ( 'undefined' !== typeof createImageBitmap ) {

        createImageBitmap( blob ).then( resolve, reject );
        return;

    }

    const url = URL.createObjectURL( blob );
    const img = new Image();

    img.addEventListener( 'load', () => { URL.revokeObjectURL( url ); resolve( img ); } );
    img.addEventListener( 'error', e => { URL.revokeObjectURL( url ); reject( e ); } );

    img.src = url;

} );

/**
 * Decodes the specified image blob into an ImageData instance.
 *
 * @param blob
 * @returns {Promise<unknown>}
 */
export default async blob => {

    // To decode an image in the backend we need support for both ImageBitmap and OffscreenCanvas.
    // If this is not the case, temporarily switch to the frontend.
    if ( is.backend && ( ! support.offscreenCanvas || ! support.imageBitmap ) ) {

        return runFrontend( 'decode', blob );

    }

    const image = await blobToImage( blob );
    const canvas = createCanvas( image );

    const context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

};
