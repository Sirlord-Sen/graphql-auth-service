import { JwtConfig } from "@config//";
import { TokenHelper } from "@helpers//";
import { VerifyOptions, JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import JWTService from "@providers/jwt/jwt.service";

export default (async (req: any, res: Response, next: NextFunction) => {
    const jwtService = new JWTService()

    const id = req.params.id
        const accessToken = TokenHelper.getTokenFromHeader(req.headers)
        req.currentUser = null
        if(accessToken) {
            console.log("Null Rejection working just fine")
            try {
                
                const publicKey = JwtConfig.publicAccessKey

                const verifyOptions: VerifyOptions = {
                    algorithms: ['RS256']
                }

                const data = await jwtService.verifyAsync<JwtPayload>(
                    accessToken,
                    publicKey,
                    verifyOptions
                )

                req.currentUser = {
                    userId: data.userId
                };

                return next();
            } 
            catch (err) { return next(err) }
        }

        return next()
})