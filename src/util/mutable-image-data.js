export default class mutableImageData {
    constructor( width, height ) {
        this.data = [];
        for ( let i = 0, c = width * height * 4; i < c; i++ ) {
            this.data.push( 0 );
        }

        this.width = width;
        this.height = height;
    }

    toImageData() {
        return new ImageData( new Uint8ClampedArray( this.data ), this.width, this.height );
    }
};
