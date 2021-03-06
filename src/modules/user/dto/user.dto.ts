import { Field, ObjectType } from "type-graphql";

import UserEntity from "@user/entity/user.entity";
import ProfileEntity from "@user/entity/profile.entity";


@ObjectType()
export class CreateUserDto{
    @Field()
    message: string

    @Field()
    user: UserEntity
}

@ObjectType()
export class uploadPhotoDto{
    @Field()
    message: string

    @Field()
    photo: string
}


@ObjectType()
export class UpdateUserDto extends CreateUserDto{
    @Field()
    profile: ProfileEntity
}