import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from 'fs';
import { join, resolve } from 'path';
import { Logger } from '@utils/logger.util';
import { v4 as uuidv4 } from 'uuid';
import UserEntity from '@user/entity/user.entity';
import { SignUpInput } from '@user/inputs/user.input';
import { Service } from 'typedi'
import { Context } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import AuthService from '@auth/services/auth.service';
import TokenService from '@auth/services/token.service';
import { LoginInput, RefreshTokenInput } from '@auth/inputs/token.input';
import { LoginDto, LogoutDto, RefreshTokenDto } from '@auth/dto/auth.dto';

@Service()
@Resolver()
export class AuthResolver{
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    )
    {}

    @Mutation(() => LoginDto)
    async login(@Arg("body") body: LoginInput, @Ctx() ctx: Context<ExpressContext>){
        const { useragent } = ctx.req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const user = await this.authService.login(body)
        const tokens = await this.tokenService.getTokens(user, userAgent)
        return { message: "Success" , user, tokens}
    }

    @Mutation(() => LogoutDto)
    @UseMiddleware(AuthMiddleware)
    async logout(@Ctx() ctx: Context<ExpressContext>) {
        const { useragent } = ctx.req
        const { userId } = ctx.req.currentUser
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser,
            userId
        }
        await this.authService.logout( userAgent )
        return { message: "Logout Successful" }
    }    

    @Mutation(() => RefreshTokenDto)
    async refreshToken(@Arg('body') body: RefreshTokenInput){
        const refreshToken = body.refreshToken
        const tokens = await this.authService.refreshToken({refreshToken: refreshToken})
        return  { tokens }
    }
    
} 