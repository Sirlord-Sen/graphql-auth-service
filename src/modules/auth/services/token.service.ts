import {SignOptions, JwtPayload, Secret} from 'jsonwebtoken'
import { getCustomRepository } from "typeorm";
import { pick } from 'lodash'
import { Service } from 'typedi'
import { nanoid } from 'nanoid'

import JWTService from "@providers/jwt/jwt.service";
import { DateHelper } from "@helpers//";
import RefreshTokenRepository from "../repository/refreshToken.repository";
import { TokenType } from "@utils/util-types";
// import { JwtConfig } from '@config//';
import UserService from '@user/services/user.service';
import RefreshTokenEntity from '@auth/entity/refreshToken.entity';
import UserEntity from '@user/entity/user.entity';
import { Logger } from '@utils/logger.util';
import { 
    FullRefreshToken, 
    IAccessTokenRequest, 
    IAccessTokenResponse, 
    IRefreshTokenRequest, 
    IRefreshTokenResponse, 
    IResolveRefreshToken, 
    ITokenRequest, 
    ITokenResponse, 
    RefreshTokenPayload, 
    UserAgent 
} from '../interfaces/token.interface';
import { readFileSync } from 'fs';

@Service()
export default class TokenService {
    private readonly refreshTokenRepository: RefreshTokenRepository
    tokenType : TokenType
    constructor(
        private readonly jwtService: JWTService,
        private readonly userService: UserService
    ){
        this.refreshTokenRepository = getCustomRepository(RefreshTokenRepository)
        this.tokenType = TokenType.BEARER 
    }

    async generateAccessToken(body:IAccessTokenRequest, confirmTokenPassword?: string):Promise<IAccessTokenResponse>{
        const { userId } = body

        const privateKeyFile = String(process.env.PRIVATE_KEY_FILE)
        const privateAccessKey = readFileSync(privateKeyFile)

        const privateAccessSecret: Secret = {
            key: privateAccessKey,
            passphrase: String(process.env.PRIVATE_KEY_PASSPHRASE)
        }
    
        const opts: SignOptions = {
            expiresIn: String(process.env.ACCESS_TOKEN_EXPIRATION),
            algorithm: 'RS256'
        }

        const payload: JwtPayload = {
            ...body,
            jti: confirmTokenPassword || nanoid(),
            sub: String(userId),
            typ: TokenType.BEARER
        };
        const accessToken = await this.jwtService.signAsync<JwtPayload>(payload, privateAccessSecret , opts)

        const ms = DateHelper.convertToMS(String(process.env.ACCESS_TOKEN_EXPIRATION))
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        return {accessToken, expiredAt}
    }

    async lastSignIn(body:IRefreshTokenRequest, useragent: UserAgent): Promise<RefreshTokenEntity | undefined>{
        const lastSignIn = (await this.refreshTokenRepository.find({
            where: {
                ...useragent, 
                ...body, 
                isRevoked: true
            },   
            order: {
                created_at: "DESC"
            }
        }))[0]

        if(lastSignIn) return lastSignIn
        return undefined
    }

    async generateRefreshToken(body:IRefreshTokenRequest, useragent: UserAgent):Promise<IRefreshTokenResponse>{
        const jti = nanoid();
        const ms = DateHelper.convertToMS(String(process.env.REFRESH_TOKEN_EXPIRATION));
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        // Only Allowing User to Login again after logout with same broswer and OS
        if ((await this.refreshTokenRepository.findOne({...useragent, ...body , isRevoked: false}))) {
            Logger.warn("Attempting to Signin again from same device")
            throw new Error ("User Already Signed In")
        }

        const lastSignIn = (await this.lastSignIn(body, useragent))?.created_at

        const savedRefreshToken = await this.refreshTokenRepository.createRefreshToken({ ...body, ...useragent ,jti, expiredAt });

        const opts: SignOptions = {
            expiresIn: String(process.env.REFRESH_TOKEN_EXPIRATION),
        }

        const payload: JwtPayload = {
            sub: String(savedRefreshToken.userId),
            jti,
            typ: TokenType.BEARER,
        };

        const refreshToken = await this.jwtService.signAsync<JwtPayload>(payload, String(process.env.REFRESH_TOKEN_SECRET), opts)

        return { refreshToken, lastSignIn }
    }

    async getTokens(user: Partial<UserEntity>, agent: UserAgent):Promise<ITokenResponse>{
        const { id, email } = user;
        const [{accessToken, expiredAt}, {refreshToken, lastSignIn}] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id }, agent)
        ]);
          
        return { tokenType: this.tokenType ,expiredAt , accessToken, refreshToken, lastSignIn };
    }

    async update(query: Partial<FullRefreshToken>, body: Partial<RefreshTokenEntity>): Promise<void>{
        await this.refreshTokenRepository.updateRefreshToken(query, body)
    }

    async resolveRefreshToken(token:string): Promise<Partial<UserEntity>> {
        const payload = await this.decodeRefreshToken(token);
        const refreshTokenFromDB = await this.getRefreshTokenFromPayload(payload);

        if (refreshTokenFromDB?.isRevoked) throw new Error('Token expired')

        const user = pick(await this.getUserFromRefreshTokenPayload(payload), ['id', 'email']);

        return user;
    }

    private async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
        const payload = this.jwtService.verify<RefreshTokenPayload>(
                token,
                String(process.env.REFRESH_TOKEN_SECRET),
            );
        const { jti, sub } = payload
        if (!jti || !sub) throw new Error('Token Malfunctioned')
        return payload
    }
    
    private async getRefreshTokenFromPayload(payload: RefreshTokenPayload): Promise<RefreshTokenEntity>{
        const { jti, sub } = payload;
        return await this.refreshTokenRepository.findOneToken({ userId: sub, jti });
    }
    
    private async getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<Partial<UserEntity>> {
        const { sub } = payload;    
        const user = await this.userService.findOne({ id: sub });
        return user.user
    }
}