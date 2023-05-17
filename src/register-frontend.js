import { registerFrontend as registerWorkerFrontend } from 'worker-relay';

import registerResolver from './register-resolver';

export default function registerFrontend( worker ) {
    registerWorkerFrontend( worker );
    registerResolver();
};
