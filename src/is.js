const isFrontend = 'undefined' !== typeof document;

export default {

    what: isFrontend ? 'frontend' : 'backend',

    frontend: isFrontend,
    backend: ! isFrontend,

    support: {

        get imageBitmap() {

            return 'undefined' !== typeof createImageBitmap;

        },

        get offscreenCanvas() {

            return 'undefined' !== typeof OffscreenCanvas;

        },

    },

};
