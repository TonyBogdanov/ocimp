export default {

    get imageBitmap() {

        return 'undefined' !== typeof createImageBitmap;

    },

    get offscreenCanvas() {

        return 'undefined' !== typeof OffscreenCanvas;

    },

};
