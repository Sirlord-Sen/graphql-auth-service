import { Field, InputType } from "type-graphql";

@InputType()
export class SignUpInput{
    @Field()
    username: string

    @Field()
    email: string

    // Make Bio an optional field
    @Field()
    bio?: string

    @Field()
    password: string

    @Field()
    phone: string

    @Field()
    firstname: string

    @Field()
    surname: string
}