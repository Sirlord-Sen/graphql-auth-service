import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'

class DBConfig{
    readonly type: any;
    readonly port: number;
    readonly database: string;
    readonly username: string;
    readonly password: string;
    readonly host: string
    readonly synchronize: boolean
  
    constructor(parsedEnv: ParsedVariables) {
  
      this.type = String(parsedEnv.DB_TYPE)
      this.port = Number(parsedEnv.ACCESS_TOKEN_EXPIRATION)
      this.database = String(parsedEnv.DB_DATABASE)
      this.username = String(parsedEnv.DB_USERNAME)
      this.password = String(parsedEnv.DB_PASSWORD)
      this.host = String(parsedEnv.DB_HOST)
      this.synchronize = Boolean(parsedEnv.DB_SYNCHRONIZE)
    }
  }
  
  export default new DBConfig(parsedEnv);