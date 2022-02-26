import UserEntity from "@user/entity/user.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CreateUserDto{
    @Field()
    message: string

    @Field()
    user: UserEntity
}

@ObjectType()
export class UpdateUserDto extends CreateUserDto{}