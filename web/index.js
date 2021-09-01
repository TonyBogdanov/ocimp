import register from '../src/register';

window.$selenium = null;
document.addEventListener( 'DOMContentLoaded', () => setTimeout( async () => {

    register();

    const suite = {};
    const context = require.context( '../tests', true, /\.js$/, 'lazy' );

    for ( const path of context.keys() ) {

        const rel = path.replace( /^[.\/]+/, '' );
        const group = rel.substr( 0, rel.length - 3 );

        suite[ group ] = ( await import( `../tests/${ rel }` ) ).default;

    }

    if ( $selenium ) {

        const results = { ok: true, stats: {} };
        for ( const [ group, tests ] of Object.entries( suite ) ) {

            results.stats[ group ] = [];
            for ( const [ name, run ] of Object.entries( tests ) ) {

                let error, start = new Date().getTime();
                try { await run( chai.assert ) } catch ( e ) { error = e }

                error ? results.ok = false : 0;
                results.stats[ group ].push( error ? error : `✓ ${ name } [${ new Date().getTime() - start }ms]` );

            }

        }

        $selenium( results );
        return;

    }

    mocha.setup( 'bdd' );

    Object.entries( suite ).forEach( ( [ group, tests ] ) =>
        describe( group, () => Object.entries( tests ).forEach( ( [ name, run ] ) =>
            it( name, async () => run( chai.assert ) ).timeout( 10000 ) ) ) );

    mocha.run();

}, 500 ) );
