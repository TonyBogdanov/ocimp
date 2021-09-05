import { runBackend } from 'worker-relay';

async function test( assert, ext, mime ) {

    const name = `file.${ ext }`;
    const lastModified = Date.now();

    const input = await ( await fetch( `/a.${ ext }` ) ).blob();
    const imageData = await runBackend( 'ocimp.decode', input );

    const output = await runBackend( 'ocimp.encode', imageData, mime );
    const file = await runBackend( 'ocimp.pack', output, name, lastModified );

    assert.instanceOf( file, File );

    assert.equal( mime, file.type );
    assert.equal( name, file.name );
    assert.equal( lastModified, file.lastModified );

}

export default {

    'Should pack blob(jpeg).': async assert => test( assert, 'jpg', 'image/jpeg' ),
    'Should pack blob(png).': async assert => test( assert, 'png', 'image/png' ),

};
