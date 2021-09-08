import { is, runFrontend } from 'worker-relay';
import support from '../support';

/**
 * Packs the specified blob into a File instance with the specified name and modification time.
 *
 * @param blob
 * @param name
 * @param lastModified
 * @returns {File}
 */
export default ( blob, name, lastModified = Date.now() ) => {

    // Safari doesn't support File in workers, we need to temporarily switch to the frontend.
    if ( is.backend && ! support.file ) {

        return runFrontend( 'ocimp.pack', blob, name, lastModified );

    }

    return new File( [ blob ], name, { type: blob.type, lastModified } );

};
