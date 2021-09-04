import is from './is';
import singleton from './singleton';
import log from './log';
import load from './load';
import listen from './listen';

export default function register( worker ) {

    if ( singleton.registered ) {

        return;

    }

    /* debug:start */
    if ( is.backend ) {

        throw `Cannot register the frontend in a backend environment.`;

    }

    log( 'Registering %s.', is.what );
    /* debug:stop */

    singleton.registered = true;
    singleton.handle = worker;

    load();
    listen();

};
