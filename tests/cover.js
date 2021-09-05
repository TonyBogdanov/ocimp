import { runBackend } from 'worker-relay';
import constant from '../src/constant';

async function test( assert, flip, h, v ) {

    const input = await ( await fetch( `/a.png` ) ).blob();
    const imageData = await runBackend( 'ocimp.decode', input );

    const path = `/test.cover.${ flip ? v : h }.png`;

    const expected = await ( await fetch( path ) ).blob();
    const expectedData = await runBackend( 'ocimp.decode', expected );

    const output = await runBackend( 'ocimp.cover', imageData, flip ? 25 : 5, flip ? 5 : 25, h, v );

    assert.instanceOf( output, ImageData );
    assert.deepEqual( output, expectedData );

}

const tests = {};

tests[ `Should generate cover imageData (h=${ constant.ALIGN_LEFT }).` ] =
    async assert => test( assert, false, constant.ALIGN_LEFT, constant.ALIGN_MIDDLE );

tests[ `Should generate cover imageData (h=${ constant.ALIGN_CENTER }).` ] =
    async assert => test( assert, false, constant.ALIGN_CENTER, constant.ALIGN_MIDDLE );

tests[ `Should generate cover imageData (h=${ constant.ALIGN_RIGHT }).` ] =
    async assert => test( assert, false, constant.ALIGN_RIGHT, constant.ALIGN_MIDDLE );

tests[ `Should generate cover imageData (v=${ constant.ALIGN_TOP }).` ] =
    async assert => test( assert, true, constant.ALIGN_CENTER, constant.ALIGN_TOP );

tests[ `Should generate cover imageData (v=${ constant.ALIGN_MIDDLE }).` ] =
    async assert => test( assert, true, constant.ALIGN_CENTER, constant.ALIGN_MIDDLE );

tests[ `Should generate cover imageData (v=${ constant.ALIGN_BOTTOM }).` ] =
    async assert => test( assert, true, constant.ALIGN_CENTER, constant.ALIGN_BOTTOM );

export default tests;
