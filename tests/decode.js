import { runBackend } from 'worker-relay';

async function test( assert, ext ) {

    const blob = await ( await fetch( `/a.${ ext }` ) ).blob();
    const imageData = await runBackend( 'ocimp.decode', blob );

    assert.instanceOf( imageData, ImageData );

}

export default {

    'Should decode blob(jpeg)->imageData.': async assert => test( assert, 'jpg' ),
    'Should decode blob(png)->imageData.': async assert => test( assert, 'png' ),
    'Should decode blob(gif)->imageData.': async assert => test( assert, 'gif' ),

};
