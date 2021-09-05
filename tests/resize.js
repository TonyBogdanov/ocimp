import { runBackend } from 'worker-relay';
import constant from '../src/constant';

async function test( assert, mode ) {

    const input = await ( await fetch( `/a.png` ) ).blob();
    const imageData = await runBackend( 'decode', input );

    const output = await runBackend( 'resize', imageData, 320, 240, mode );

    assert.instanceOf( output, ImageData );
    assert.equal( 320, output.width );
    assert.equal( 240, output.height );
    assert.lengthOf( output.data, 307200 );

}

const tests = {};

tests[ `Should resize imageData with ${ constant.RESIZE_NEAREST_NEIGHBOR } mode.` ] = async assert =>
    test( assert, constant.RESIZE_NEAREST_NEIGHBOR );

tests[ `Should resize imageData with ${ constant.RESIZE_BILINEAR } mode.` ] = async assert =>
    test( assert, constant.RESIZE_BILINEAR );

tests[ `Should resize imageData with ${ constant.RESIZE_BICUBIC } mode.` ] = async assert =>
    test( assert, constant.RESIZE_BICUBIC );

tests[ `Should resize imageData with ${ constant.RESIZE_HERMITE } mode.` ] = async assert =>
    test( assert, constant.RESIZE_HERMITE );

tests[ `Should resize imageData with ${ constant.RESIZE_BEZIER } mode.` ] = async assert =>
    test( assert, constant.RESIZE_BEZIER );

export default tests;
