import { runBackend } from 'worker-relay';
import constant from '../src/constant';

async function test( assert, outside, mode ) {
    const input = await ( await fetch( `/a.png` ) ).blob();
    const imageData = await runBackend( 'ocimp.decode', input );

    const output = await runBackend( 'ocimp.fit', imageData, 200, 200, outside, mode );

    assert.instanceOf( output, ImageData );
    assert.equal( outside ? 356 : 200, output.width );
    assert.equal( outside ? 200 : 113, output.height );
    assert.lengthOf( output.data, outside ? 284800 : 90400 );
}

const tests = {};

tests[ `Should fit imageData (inside) with ${ constant.RESIZE_NEAREST_NEIGHBOR } mode.` ] = async assert =>
    test( assert, false, constant.RESIZE_NEAREST_NEIGHBOR );

tests[ `Should fit imageData (inside) with ${ constant.RESIZE_BILINEAR } mode.` ] = async assert =>
    test( assert, false, constant.RESIZE_BILINEAR );

tests[ `Should fit imageData (inside) with ${ constant.RESIZE_BICUBIC } mode.` ] = async assert =>
    test( assert, false, constant.RESIZE_BICUBIC );

tests[ `Should fit imageData (inside) with ${ constant.RESIZE_HERMITE } mode.` ] = async assert =>
    test( assert, false, constant.RESIZE_HERMITE );

tests[ `Should fit imageData (inside) with ${ constant.RESIZE_BEZIER } mode.` ] = async assert =>
    test( assert, false, constant.RESIZE_BEZIER );

tests[ `Should fit imageData (outside) with ${ constant.RESIZE_NEAREST_NEIGHBOR } mode.` ] = async assert =>
    test( assert, true, constant.RESIZE_NEAREST_NEIGHBOR );

tests[ `Should fit imageData (outside) with ${ constant.RESIZE_BILINEAR } mode.` ] = async assert =>
    test( assert, true, constant.RESIZE_BILINEAR );

tests[ `Should fit imageData (outside) with ${ constant.RESIZE_BICUBIC } mode.` ] = async assert =>
    test( assert, true, constant.RESIZE_BICUBIC );

tests[ `Should fit imageData (outside) with ${ constant.RESIZE_HERMITE } mode.` ] = async assert =>
    test( assert, true, constant.RESIZE_HERMITE );

tests[ `Should fit imageData (outside) with ${ constant.RESIZE_BEZIER } mode.` ] = async assert =>
    test( assert, true, constant.RESIZE_BEZIER );

export default tests;
