import { Field, ObjectType } from "type-graphql";

import UserEntity from "@user/entity/user.entity";

@ObjectType()
export class CreateUserDto{
    @Field()
    message: string

    @Field()
    user: UserEntity
}

@ObjectType()
export class UpdateUserDto extends CreateUserDto{}