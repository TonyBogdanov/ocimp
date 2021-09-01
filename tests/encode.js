import run from '../src/backend/run';

async function test( assert, ext, mime ) {

    const input = await ( await fetch( `/a.${ ext }` ) ).blob();
    const imageData = await run( 'decode', input );

    const output = await run( 'encode', imageData, mime );

    assert.instanceOf( output, Blob );
    assert.equal( mime, output.type );

}

export default {

    encode: {

        'Should encode imageData->blob(jpeg).': async assert => test( assert, 'jpg', 'image/jpeg' ),
        'Should encode imageData->blob(png).': async assert => test( assert, 'png', 'image/png' ),

    },

};
