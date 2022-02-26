import { Field, ObjectType } from "type-graphql";

import { TokenType } from "@utils/util-types";
import UserEntity from "@user/entity/user.entity";

export interface ITokenPayload{
    jti: string;
    sub: string;
    typ: string;
};

@ObjectType()
export class RefreshTokenResponse {
    @Field()
    accessToken: string

    @Field()
    refreshToken: string

    @Field()
    tokenType: TokenType

    @Field()
    expiredAt: Date
}

@ObjectType()
export class ITokenResponse extends RefreshTokenResponse{
    @Field({nullable: true})
    lastSignIn?: Date
}

export interface ITokenRequest {
    email: string,
    id:string
}

export type IResolveRefreshToken = Pick<UserEntity, 'id' | 'email'>

export interface IRefreshToken{
    refreshToken: string
}

export interface IAccessTokenRequest{
    userId: string,
    email: string
}

export interface IAccessTokenResponse{
    accessToken: string, 
    expiredAt: Date
}

export interface IRefreshTokenResponse{
    refreshToken: string, 
    lastSignIn: Date | undefined
}

export interface IRefreshTokenRequest {
    userId: string
}

export interface FullRefreshToken{
    id: string
    browser?: string;
    expiredAt: Date;
    ip?: string;
    isRevoked?: boolean;
    jti: string;
    os?: string;
    userAgent?: string;
    userId: string;
}

export type UserAgent = Partial<FullRefreshToken>

export interface RefreshTokenPayload{
    jti: string;
    sub: string;
    typ: string;
};