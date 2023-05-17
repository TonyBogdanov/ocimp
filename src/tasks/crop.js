/**
 * Crops the specified ImageData to the specified dimensions with the specified x, y offset.
 *
 * If any of the offsets are negative, the missing pixels will be transparent. This is also valid if the target
 * dimensions are bigger than the data available after cropping.
 *
 * If one or more of the dimensions are NULL, the value is inferred from the available size after applying the
 * corresponding offset.
 *
 * @param imageData
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {Promise<ImageData>}
 */
export default async ( imageData, x, y, width = null, height = null ) => {
    width = null === width ? imageData.width - x : width;
    height = null === height ? imageData.height - y : height;

    const result = new ImageData( width, height );
    for ( let dy = 0; dy < height; dy++ ) {
        for ( let dx = 0; dx < width; dx++ ) {
            const sx = x + dx;
            const sy = y + dy;

            const si = 4 * ( sy * imageData.width + sx );
            const di = 4 * ( dy * width + dx );

            if ( sx < 0 || sy < 0 || sx >= imageData.width || sy >= imageData.height ) {
                result.data[ di ]     = 0;
                result.data[ di + 1 ] = 0;
                result.data[ di + 2 ] = 0;
                result.data[ di + 3 ] = 0;

                continue;
            }

            result.data[ di ]     = imageData.data[ si ];
            result.data[ di + 1 ] = imageData.data[ si + 1 ];
            result.data[ di + 2 ] = imageData.data[ si + 2 ];
            result.data[ di + 3 ] = imageData.data[ si + 3 ];
        }
    }

    return result;
};
