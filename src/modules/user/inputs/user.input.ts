import { Stream } from "stream";
import { FileUpload } from "graphql-upload";
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
    name: string
}

@InputType()
export class UpdateInput extends SignUpInput{}

