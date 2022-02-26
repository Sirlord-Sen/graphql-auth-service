import { Field, ObjectType } from "type-graphql";

import { ITokenResponse } from "@auth/interfaces/token.interface";
import UserEntity from "@user/entity/user.entity";

@ObjectType()
export class LoginDto{
    @Field()
    message: string

    @Field()
    user: UserEntity

    @Field()
    tokens: ITokenResponse
}

@ObjectType()
export class LogoutDto{
    @Field()
    message: string
}

@ObjectType()
export class RefreshTokenDto{
    @Field()
    tokens: ITokenResponse
}