import { Field, ObjectType } from "type-graphql";

import { TokenType } from "@utils/util-types";
import UserEntity from "@user/entity/user.entity";

export interface ITokenPayload{
    jti: string;
    sub: string;
    typ: string;
};

@ObjectType()
export class ITokenResponse {
    @Field()
    accessToken: string

    @Field()
    refreshToken: string

    @Field()
    tokenType: TokenType

    @Field()
    expiredAt: Date
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