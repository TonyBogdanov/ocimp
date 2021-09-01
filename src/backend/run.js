import doRun from '../run';

export default function run( name, ... args ) {

    return doRun( 'backend', name, args );

};
