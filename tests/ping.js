import runBackend from '../src/backend/run';
import runFrontend from '../src/frontend/run';

export default {

    'Should get challenge response from frontend.': async assert =>
        assert.deepEqual( [ 'foo', 'frontend' ], await runFrontend( 'ping', 'foo' ) ),

    'Should get challenge response from backend.': async assert =>
        assert.deepEqual( [ 'bar', 'backend' ], await runBackend( 'ping', 'bar' ) ),

};
