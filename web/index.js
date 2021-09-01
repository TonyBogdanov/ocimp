import register from '../src/register';

( async () => {

    register();
    mocha.setup( 'bdd' );

    const context = require.context( '../tests', true, /\.js$/ );
    for ( const path of context.keys() ) {

        const suite = ( await import( `../tests/${ path.replace( /^[.\/]+/, '' ) }` ) ).default;

        Object.entries( suite ).forEach( ( [ group, tests ] ) =>
            describe( group, () => Object.entries( tests ).forEach( ( [ should, run ] ) =>
                it( should, () => run( chai.assert ) ).timeout( 5000 ) ) ) );

    }

    mocha.run();

} )();
