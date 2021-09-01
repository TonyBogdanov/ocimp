const { spawn } = require( 'child_process' );
const kill = require( 'tree-kill' );
const browserstack = require( 'browserstack-local' );
const webdriver = require( 'selenium-webdriver' );
const pool = require( '@supercharge/promise-pool' );
const version = require( 'compare-versions' );
const getCapabilities = require( 'browserslist-browserstack' ).default;

async function capabilities() {

    console.log( 'Resolving browser capabilities.' );
    const caps = await getCapabilities( {

        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,

    } );

    const candidates = {};
    for ( const cap of caps ) {

        if (

            ! candidates.hasOwnProperty( cap.browserName ) ||
            0 < version( candidates[ cap.browserName ].browserVersion, cap.browserVersion )

        ) {

            candidates[ cap.browserName ] = cap;

        }

    }

    return Object.values( candidates );

}

async function wp( callback ) {

    console.debug( 'Starting webpack.' );
    return new Promise( async ( resolve, reject ) => {

        let result, error;

        const p = spawn( 'win32' === process.platform ? 'npm.cmd' : 'npm', [ 'run', 'webpack' ], { cwd: __dirname } );
        const g = async data => {

            if ( -1 === data.indexOf( 'compiled' ) || -1 === data.indexOf( 'successfully' ) ) {

                return;

            }

            try { result = await callback() } catch ( e ) { error = e }

            console.debug( 'Stopping webpack.' );
            kill( p.pid );

        };

        p.stdout.on( 'data', g );
        p.stderr.on( 'data', g );

        p.on( 'close', () => error ? reject( error ) : resolve( result ) );

    } );

}

async function bs( callback ) {

    console.debug( 'Starting browserstack.' );
    return new Promise( async ( resolve, reject ) => {

        const p = new browserstack.Local();
        p.start( Object.assign( { forceLocal: true } ), async e => {

            if ( e ) {

                return reject( e );

            }

            let result, error;
            try { result = await callback() } catch( e ) { error = e }

            console.debug( 'Stopping browserstack.' );
            p.stop( () => error ? reject( error ) : resolve( result ) );

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

    let result, error;
    try { result = await callback( p ) } catch ( e ) { error = e }

    console.debug( `Stopping ${ caps.browserName }@${ caps.browserVersion }.` );
    await p.quit();

    if ( error ) {

        throw error;

    }

    return result;

}

( async () => {

    try {

        await wp( () => bs( async () => await pool.withConcurrency( 5 ).for( ( await capabilities() ).map( caps =>
            () => wd( caps, async d => {

                await d.get( 'http://localhost:9090' );
                const { ok, stats } = await d.executeAsyncScript( 'window.$selenium=arguments[arguments.length-1]' );

                await d.executeScript( `browserstack_executor:{"action":"setSessionStatus","arguments":{"status":"${
                    ok ? 'passed' : 'failed' }"}}` );

                console.log( `  ${ caps.browserName }@${ caps.browserVersion }: ${ ok ?
                    'All tests succeeded.' : 'Some tests failed.' }\n` );

                for ( const [ group, results ] of Object.entries( stats ) ) {

                    console.log( `    ${ group }` );
                    for ( const line of results ) {

                        console.log( `      ${ line }` );

                    }

                }

                console.log( '' );

            }
        ) ) ).process( async c => c() ) ) );

    } catch ( e ) {

        console.error( e );
        process.exit( 1 );

    }

} )();
