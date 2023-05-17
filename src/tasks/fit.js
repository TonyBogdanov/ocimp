import { runBackend } from 'worker-relay';
import constant from '../constant';

/**
 * Scales the specified ImageData to the target "fit" dimensions.
 *
 * If outside is TRUE, the resulting image will be at-least as big as the fit dimensions, if outside is FALSE, the
 * resulting image will be at-most as big as the fit dimensions.
 *
 * You can also optionally specify an interpolation mode for the resizing.
 *
 * @param imageData
 * @param fitWidth
 * @param fitHeight
 * @param outside
 * @param resizeMode
 * @returns {Promise<*>}
 */
export default async ( imageData, fitWidth, fitHeight, outside = false, resizeMode = constant.RESIZE_BILINEAR ) => {
    let width = fitWidth;
    let height = Math.round( width * imageData.height / imageData.width );

    if ( ( height < fitHeight && outside ) || ( height > fitHeight && ! outside ) ) {
        height = fitHeight;
        width = Math.round( height * imageData.width / imageData.height );
    }

    return await runBackend( 'ocimp.resize', imageData, width, height, resizeMode );
};
