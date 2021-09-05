import { runFrontend } from 'worker-relay';
import is from 'worker-relay/src/is';
import support from '../support';
import createCanvas from '../util/create-canvas';

/**
 * Encodes the specified ImageData instance into an image blob with the specified MIME type and quality.
 *
 * @param imageData
 * @param type
 * @param quality
 * @returns {Promise<unknown>}
 */
export default async ( imageData, type = 'image/png', quality = 0.8 ) => {

    // To encode an image in the backend we need support for OffscreenCanvas.
    // If this is not the case, temporarily switch to the frontend.
    if ( is.backend && ! support.offscreenCanvas ) {

        return runFrontend( 'encode', imageData, type, quality );

    }

    const canvas = createCanvas( imageData );
    const context = canvas.getContext( '2d' );

    context.putImageData( imageData, 0, 0 );
    if ( support.offscreenCanvas && canvas instanceof OffscreenCanvas ) {

        const name = canvas.convertToBlob ? 'convertToBlob' : 'toBlob'; // Firefox uses toBlob.
        return await canvas[ name ]( { type, quality } );

    }

    if ( canvas.toBlob ) {

        return await new Promise( resolve => canvas.toBlob( resolve, type, quality ) );

    }

    // Safari doesn't support HTMLCanvasElement.toBlob().
    const bytes = atob( canvas.toDataURL( type, quality ).split( ',' )[1] );
    const array = [];

    for ( let i = 0; i < bytes.length; i++ ) {

        array.push( bytes.charCodeAt( i ) );

    }

    return new Blob( [ new Uint8Array( array ) ], { type } );

};
