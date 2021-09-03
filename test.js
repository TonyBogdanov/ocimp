const { spawn } = require( 'child_process' );
const kill = require( 'tree-kill' );
const browserstack = require( 'browserstack-local' );
const webdriver = require( 'selenium-webdriver' );
const getCapabilities = require( 'browserslist-browserstack' ).default;

async function capabilities() {

    console.log( 'Resolving browser capabilities.' );
    const caps = await getCapabilities( {

        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,

    } );

    const candidates = {};
    for ( const cap of caps ) {

        const key = `${ cap.browserName }@${ cap.browserVersion }`;
        if ( ! candidates.hasOwnProperty( key ) ) {

            candidates[ key ] = cap;

        }

    }

    return Object.values( candidates );

}

async function invoke( callback ) {

    let result = undefined, error = undefined;
    try { result = await callback() } catch ( e ) { error = e }

    return [ result, error ];

}

async function wp( callback ) {

    console.debug( 'Starting webpack.' );
    return new Promise( async ( resolve, reject ) => {

        let started = false, stderr = '', result = undefined, error = undefined;

        const p = spawn( 'win32' === process.platform ? 'npm.cmd' : 'npm', [ 'run', 'webpack' ], { cwd: __dirname } );
        const g = async data => {

            if ( started || -1 === data.indexOf( 'compiled' ) || -1 === data.indexOf( 'successfully' ) ) {

                return;

            }

            started = true;
            [ result, error ] = await invoke( callback );

            console.debug( 'Stopping webpack.' );
            kill( p.pid );

        };

        p.stdout.on( 'data', g );
        p.stderr.on( 'data', data => { stderr += data; g( data ) } );

        p.on( 'close', () => ! started ? reject( stderr ) : error ? reject( error ) : resolve( result ) );

    } );

}

async function bs( callback ) {

    console.debug( 'Starting browserstack.' );
    return new Promise( async ( resolve, reject ) => {

        const bs = new browserstack.Local();
        bs.start( { forceLocal: true }, async e => {

            if ( e ) {

                return reject( e );

            }

            if ( ! bs.isRunning() ) {

                return reject( 'BrowserStack Local is not running.' );

            }

            let [ result, error ] = await invoke( callback );

            console.debug( 'Stopping browserstack.' );
            bs.stop( () => error ? reject( error ) : resolve( result ) );

        } );

    } );

}

async function wd( caps, callback ) {

    console.debug( `Starting ${ caps.browserName }@${ caps.browserVersion }.` );
    const p = new webdriver.Builder()
        .usingServer( 'https://hub-cloud.browserstack.com/wd/hub' )
        .withCapabilities( Object.assign( {

            'browserstack.user': process.env.BROWSERSTACK_USERNAME,
            'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
            'build': 'ocimp',
            'name': 'ocimp',
            'browserstack.debug': 'true',
            'browserstack.console': 'errors',
            'browserstack.local': true,

        }, caps ) )
        .build();

    const [ result, error ] = await invoke( () => callback( p ) );

    console.debug( `Stopping ${ caps.browserName }@${ caps.browserVersion }.` );
    await p.quit();

    if ( error ) {

        throw error;

    }

    return result;

}

( async () => {

    try {

        await wp( () => bs( async () => {

            for ( const cap of await capabilities() ) {

                await wd( cap, async driver => {

                    await driver.manage().setTimeouts( { script: 60000, pageLoad: 60000, implicit: 60000 } );
                    await driver.get( 'http://localhost:9090' );

                    const { ok, stats } = await driver.executeAsyncScript(
                        'window.$selenium=arguments[arguments.length-1]' );

                    await driver.executeScript( `browserstack_executor:${ JSON.stringify( { action: 'setSessionStatus',
                        arguments: { status: ok ? 'passed' : 'failed' } } ) }` );

                    console.log( `  ${ cap.browserName }@${ cap.browserVersion }: ${ ok ? 'SUCCESS' : 'FAILURE' }\n` );
                    for ( const [ group, results ] of Object.entries( stats ) ) {

                        console.log( `    ${ group }` );
                        for ( const line of results ) {

                            console.log( `      ${ line }` );

                        }

                    }

                    console.log( '' );

                } );

            }

        } ) );

    } catch ( e ) {

        console.error( e );
        process.exit( 1 );

    }

} )();
