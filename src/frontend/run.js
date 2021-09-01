import doRun from '../run';

export default function run( name, ... args ) {

    return doRun( 'frontend', name, args );

};
