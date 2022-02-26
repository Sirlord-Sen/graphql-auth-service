import { Field, InputType } from "type-graphql";

@InputType()
export class RefreshTokenInput{
    @Field()
    refreshToken: string
}

@InputType()
export class LoginInput{
    @Field()
    email: string

    @Field()
    password: string
}