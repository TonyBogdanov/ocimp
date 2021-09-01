import run from './backend/run';

export default function runPingTest() {

    const challenge = Math.random();
    let timeout = setTimeout( () => console.error( 'OCIMP\'s worker backend fails the initial ping check. Make' +
        ' sure you\'ve properly registered the worker.' ), 1000 );

    run( 'ping', challenge ).then( ( [ answer, f ] ) => {

        clearTimeout( timeout );
        if ( answer === challenge && false === f ) {

            return;

        }

        console.error( 'OCIMP\'s worker backend fails to answer the initial ping check properly. Make sure you' +
            ' are not registering the worker multiple times.' );

    }, console.error );

};
