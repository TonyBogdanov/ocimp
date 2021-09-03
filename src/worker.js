import is from './is';
import singleton from './singleton';
import log from './log';
import load from './load';
import listen from './listen';

if ( ! singleton.handle ) {

    /* debug:start */
    if ( is.frontend ) {

        throw `Cannot register the backend in a frontend environment.`;

    }

    log( 'Registering %s.', is.what );
    /* debug:stop */

    singleton.handle = self;

    load();
    listen();

}
