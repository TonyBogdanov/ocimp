import { runBackend } from 'worker-relay';

async function test( assert, ext, mime ) {
    const input = await ( await fetch( `/a.${ ext }` ) ).blob();
    const imageData = await runBackend( 'ocimp.decode', input );

    const output = await runBackend( 'ocimp.encode', imageData, mime );
    const file = await runBackend( 'ocimp.pack', output, 'file', 0 );

    const uri = await runBackend( 'ocimp.urify', file );

    assert.isString( uri );
    assert.equal( `data:${ mime };base64,`, uri.substr( 0, mime.length + 13 ) );
}

export default {
    'Should uri-fy blob(jpeg).': async assert => test( assert, 'jpg', 'image/jpeg' ),
    'Should uri-fy blob(png).': async assert => test( assert, 'png', 'image/png' ),
};
