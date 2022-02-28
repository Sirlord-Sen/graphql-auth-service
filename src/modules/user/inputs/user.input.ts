import { Stream } from "stream";
import { FileUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";
import { LoginInput } from "@auth/inputs/auth.input";

@InputType()
export class SignUpInput extends LoginInput{

}

@InputType()
export class UpdateInput{
    @Field({nullable: true})
    username?: string

    @Field({nullable: true})
    email?: string

    // Make Bio an optional field
    @Field({nullable: true})
    bio?: string

    @Field({nullable: true})
    password?: string

    @Field({nullable: true})
    phone?: string

    @Field({nullable: true})
    name?: string
}

