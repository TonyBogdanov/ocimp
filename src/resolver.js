let tasks = undefined;

export default function resolver( name ) {
    if ( 'undefined' === typeof tasks ) {
        const proxy = fn => async ( ... args ) => ( await fn() ).default( ... args );

        tasks = {
            'ocimp.contain': proxy( () => import( './tasks/contain' ) ),
            'ocimp.cover': proxy( () => import( './tasks/cover' ) ),
            'ocimp.crop': proxy( () => import( './tasks/crop' ) ),
            'ocimp.decode': proxy( () => import( './tasks/decode' ) ),
            'ocimp.encode': proxy( () => import( './tasks/encode' ) ),
            'ocimp.fit': proxy( () => import( './tasks/fit' ) ),
            'ocimp.pack': proxy( () => import( './tasks/pack' ) ),
            'ocimp.resize': proxy( () => import( './tasks/resize' ) ),
            'ocimp.urify': proxy( () => import( './tasks/urify' ) ),
        };
    }

    return tasks.hasOwnProperty( name ) ? tasks[ name ] : null;
};
