import constant from '../constant';
import run from '../backend/run';

export default async (

    imageData,
    fitWidth,
    fitHeight,
    hAlign = constant.ALIGN_CENTER,
    vAlign = constant.ALIGN_MIDDLE,
    resizeMode = constant.RESIZE_BILINEAR

) => {

    /* debug:start */
    if ( -1 === constant.HORIZONTAL_ALIGNS.indexOf( hAlign ) ) {

        throw `Invalid cover horizontal align mode: ${ hAlign }, valid modes are: ${
            constant.HORIZONTAL_ALIGNS.join( ', ' ) }.`;

    }

    if ( -1 === constant.VERTICAL_ALIGNS.indexOf( vAlign ) ) {

        throw `Invalid cover vertical align mode: ${ vAlign }, valid modes are: ${
            constant.VERTICAL_ALIGNS.join( ', ' ) }.`;

    }
    /* debug:stop */

    const scaled = await run( 'fit', imageData, fitWidth, fitHeight, true, resizeMode );

    const x = hAlign === constant.ALIGN_CENTER ? Math.round( ( scaled.width - fitWidth ) / 2 ) :
        hAlign === constant.ALIGN_RIGHT ? scaled.width - fitWidth : 0;

    const y = vAlign === constant.ALIGN_MIDDLE ? Math.round( ( scaled.height - fitHeight ) / 2 ) :
        vAlign === constant.ALIGN_BOTTOM ? scaled.height - fitHeight : 0;

    return await run( 'crop', scaled, x, y, fitWidth, fitHeight );

};
