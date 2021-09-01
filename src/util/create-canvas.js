import is from '../is';

export default function createCanvas( { width, height } ) {

    if ( is.support.offscreenCanvas ) {

        return new OffscreenCanvas( width, height );

    }

    const canvas = document.createElement( 'canvas' );

    canvas.width = width;
    canvas.height = height;

    return canvas;

};
