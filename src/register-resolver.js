import { registerResolver as registerWorkerResolver } from 'worker-relay';
import resolver from './resolver';

export default function registerResolver() {

    registerWorkerResolver( resolver );

};
