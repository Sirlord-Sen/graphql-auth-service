import { VerifyOptions, JwtPayload } from 'jsonwebtoken'
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Service } from "typedi";

import JWTService from "@providers/jwt/jwt.service";
import { JwtConfig } from "@config//";
import { TokenHelper } from "@helpers//";


@Service()
export class AuthMiddleware implements MiddlewareInterface<ExpressContext>{
    constructor(private readonly jwtService: JWTService) {}
  
    async use({ context, info }: ResolverData<ExpressContext>, next: NextFn) {
        const { req } = context
        const accessToken = TokenHelper.getTokenFromHeader(req.headers)
        if(accessToken) {
            try {
                
                const publicKey = JwtConfig.publicAccessKey

                const verifyOptions: VerifyOptions = {
                    algorithms: ['RS256']
                }

                const data = await this.jwtService.verifyAsync<JwtPayload>(
                    accessToken,
                    publicKey,
                    verifyOptions
                )

                req.currentUser = {
                    userId: data.userId
                };

                return next();
            } 
            catch (err:any) { throw new Error(err)}
        }
        throw new Error("No Token Found")
    }
  }