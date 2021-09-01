import register from './src/register';
import runPingTest from './src/run-ping-test';
import runBackend from './src/backend/run';
import runFrontend from './src/frontend/run';

const backend = { run: runBackend };
const frontend = { run: runFrontend };

export { register, runPingTest, backend, frontend };
