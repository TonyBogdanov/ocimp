import { registerBackend as registerWorkerBackend } from 'worker-relay';

import registerResolver from './register-resolver';

export default function registerBackend() {

    registerWorkerBackend();
    registerResolver();

};
