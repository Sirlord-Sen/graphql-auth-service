import { StreamOptions } from "morgan";
import morgan from 'morgan'
import { Logger }  from '@utils/logger.util'

const stream: StreamOptions = { 
    write: (message) => Logger.http(message),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

const morganMiddleware = morgan('short', {stream, skip})

export default morganMiddleware