import { runBackend } from 'worker-relay';

async function test( assert, x, y, w, h ) {
    const input = await ( await fetch( `/a.png` ) ).blob();
    const imageData = await runBackend( 'ocimp.decode', input );

    const path = `/test.crop.${ x }.${ y }.${ null === w ? 'n' : w }.${ null === h ? 'n' : h }.png`;

    const expected = await ( await fetch( path ) ).blob();
    const expectedData = await runBackend( 'ocimp.decode', expected );

    const output = await runBackend( 'ocimp.crop', imageData, x, y, w, h );

    assert.instanceOf( output, ImageData );
    assert.deepEqual( output, expectedData );
}

export default {
    'Should crop imageData (x=0, y=0, w=20, h=10).': async assert => test( assert, 0, 0, 20, 10 ),
    'Should crop imageData (x=-5, y=-5, w=20, h=10).': async assert => test( assert, -5, -5, 20, 10 ),
    'Should crop imageData (x=1915, y=1075, w=20, h=10).': async assert => test( assert, 1915, 1075, 20, 10 ),
};
