export default {

    get file() {

        return 'undefined' !== typeof File;

    },

    get imageBitmap() {

        return 'undefined' !== typeof createImageBitmap;

    },

    get offscreenCanvas() {

        return 'undefined' !== typeof OffscreenCanvas;

    },

};
