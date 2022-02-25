import jwt, { Secret, SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken';
import { DateHelper } from '@helpers//';
import { Logger } from '@utils/logger.util';
import { CodeError } from '@utils/util-types' 
import { ForbiddenError } from 'apollo-server-express';

export default class JWTService {

    async signAsync<T>(payload: T, secret: Secret, opts?: SignOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { ...payload, iat: DateHelper.getUnixTimeOfDate() },
                secret,
                opts || {},
                (err: CodeError | null, encoded) => {
                    if (err) {
                        Logger.error(`${err}`)
                        reject(err)
                    }
                    resolve(encoded as string)}
            );
        });
    }

    async verifyAsync<T>(token: string, key: Secret, opts: VerifyOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, key, opts, (error: VerifyErrors | null, decoded) => {
                if (error && error.name === 'TokenExpiredError')
                    return reject(error);
                if (decoded)
                    return resolve(decoded as unknown as T);
                
                return reject(new ForbiddenError('Something bad happened'));
            });
        });
    }

}