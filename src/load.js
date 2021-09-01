import singleton from './singleton';

export default function load() {

    const context = require.context( './tasks', true, /\.js$/, 'lazy' );
    context.keys().forEach( path => {

        const rel = path.replace( /^[.\/]+/, '' );
        const name = rel.replace( /\.js$/, '' );

        singleton.tasks[ name ] = () => import( `./tasks/${ rel }` );

    } );

};
