import 'reflect-metadata';
import { DBConnection } from  '@db//'
import Server from './server';

async function bootstrap() {
    await DBConnection.on()
    new Server()
}

bootstrap()