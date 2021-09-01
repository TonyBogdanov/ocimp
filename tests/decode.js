import run from '../src/backend/run';

async function test( assert, ext ) {

    const blob = await ( await fetch( `/a.${ ext }` ) ).blob();
    const imageData = await run( 'decode', blob );

    assert.instanceOf( imageData, ImageData );

}

export default {

    decode: {

        'Should decode blob(jpeg)->imageData.': async assert => test( assert, 'jpg' ),
        'Should decode blob(png)->imageData.': async assert => test( assert, 'png' ),
        'Should decode blob(gif)->imageData.': async assert => test( assert, 'gif' ),

    },

};
