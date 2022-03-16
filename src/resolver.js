let tasks = undefined;

export default function resolver( name ) {

    if ( 'undefined' === typeof tasks ) {

        tasks = {};
        const context = require.context( './tasks', true, /\.js$/, 'lazy' );

        context.keys().forEach( path => {

            const rel = path.replace( /^[.\/]+/, '' );
            const name = rel.replace( /\.js$/, '' );

            tasks[ `ocimp.${ name }` ] = async ( ... args ) =>
                ( await import( /* @vite-ignore */ `./tasks/${ rel }` ) ).default( ... args );

        } );

    }

    return tasks.hasOwnProperty( name ) ? tasks[ name ] : null;

};
