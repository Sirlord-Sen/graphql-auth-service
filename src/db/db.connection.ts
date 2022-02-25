import { ConnectionOptions, createConnection, getConnection } from 'typeorm'
import { Logger } from '@utils/logger.util'
import { DBConfig } from '@config//'

const { type ,username, password, database, synchronize, host, port } = DBConfig

class Connection{
    config: ConnectionOptions
    constructor(){
        this.config = {
            type,
            host,
            port,
            username,
            password,
            database,
            synchronize,
            entities: ["src/modules/**/*.entity.ts"],
            subscribers: ["src/modules/**/*.subscriber.ts"]
        }
    }

    async on(){
        try{
            await createConnection(this.config)
            Logger.info("Database Connected!!!")
        }
        catch(err){ Logger.error(err) }
    }

    async close(){
        try{
            await getConnection().close()
            Logger.info("Database Closed!!!")
        }
        catch(err){Logger.error(err)}
    }
}

export default new Connection()