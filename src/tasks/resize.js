import resize2 from '@jimp/plugin-resize/src/modules/resize2';
import constant from '../constant';
import mutableImageData from '../util/mutable-image-data';

/**
 * Resizes the specified ImageData to the specified dimensions using the specified interpolation mode.
 *
 * @param imageData
 * @param width
 * @param height
 * @param mode
 * @returns {Promise<ImageData>}
 */
export default async ( imageData, width, height, mode = constant.RESIZE_BILINEAR ) => {

    /* debug:start */
    if ( -1 === constant.RESIZE_MODES.indexOf( mode ) ) {

        throw `Invalid resize mode: ${ mode }, valid modes are: ${ constant.RESIZE_MODES.join( ', ' ) }.`;

    }
    /* debug:stop */

    const result = new mutableImageData( width, height );
    resize2[ mode ]( imageData, result );

    return result.toImageData();

};
