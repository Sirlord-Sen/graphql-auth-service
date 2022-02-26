import * as path from 'path'
import { Logger }  from '@utils/logger.util';
import { parsedEnv } from '@config//';
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql';
import { Container } from "typedi";
import express from 'express'
import { Application } from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import morganMiddleware  from '@middlewares/morgan.middleware';
import useragent from 'express-useragent'
import { graphqlUploadExpress } from 'graphql-upload';

export default class ExpressServer {
    public app: Application;
  
    constructor(){
        this.app = express();
        this.middlerwares();
        this.apolloStart();
        this.start()
    }

    // Including Express Middlewares
    private middlerwares(){
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(morganMiddleware)
        this.app.use(useragent.express())
        this.app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    }  

    // Express Server
    private async start(){
        const port = parsedEnv.PORT
        this.app.listen(port, () => {
            Logger.info(`Server Started! Http: http://localhost:${port}`)
        });
    }

    // Apollo GraphQL Server
    private async apolloStart(){
        const Resolvers = path.resolve(__dirname, "modules/**/*.resolver.ts")

        const apolloServer = new ApolloServer({
            // Disabling Apollo's default upload system
            uploads: false,
            schema: await buildSchema({
              resolvers: [Resolvers],
              container: Container
            }),
            context: ({ req, res }) => ({req, res})
        })
        const app = this.app

        apolloServer.applyMiddleware({app, cors: false})
      }
    
}





