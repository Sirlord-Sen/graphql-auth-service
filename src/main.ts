import 'reflect-metadata';

import { DBConnection } from  '@db//'
import Server from './server';

declare global {
    namespace Express {
        interface Request {
            currentUser: {
                userId: string
            }
        }
    }
}
async function bootstrap() {
    
    await DBConnection.on()
    new Server()
}

bootstrap()