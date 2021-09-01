import singleton from './singleton';
import log from './log';

export default async function execute( payload ) {

    /* debug:start */
    if ( ! singleton.tasks.hasOwnProperty( payload.data.name ) ) {

        throw new Error( `[OCIMP_ERROR] Invalid task: ${ payload.data.name }.` );

    }

    log( `Executing %s = %s.`, payload.data.name, payload.id );
    /* debug:stop */

    return await ( await singleton.tasks[ payload.data.name ]() ).default( ... payload.data.args );

}
