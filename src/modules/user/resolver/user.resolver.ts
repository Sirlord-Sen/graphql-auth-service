import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from 'fs';
import { join, resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi'
import { Context } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { 
    Arg, 
    Ctx, 
    Mutation, 
    Query, 
    Resolver, 
    UseMiddleware 
} from 'type-graphql'

import { Logger } from '@utils/logger.util';
import UserService from '@user/services/user.service';
import { SignUpInput, UpdateInput } from '@user/inputs/user.input';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { CreateUserDto, UpdateUserDto, uploadPhotoDto } from '@user/dto/user.dto';
import { UpdateUserClean } from "@helpers//";
import { UserDto } from "@auth/dto/auth.dto";

@Service()
@Resolver()
export class UserResolver{
    constructor(
        private readonly userService: UserService
    ){}

    @Query(() => String)
    hello(){
        return 'hello world'
    }


    @Mutation(() => uploadPhotoDto)
    @UseMiddleware(AuthMiddleware)
    async uploadPhoto(
        @Arg("file", () => GraphQLUpload) {createReadStream, mimetype} : FileUpload,
        @Ctx() ctx: Context<ExpressContext>
        ) {
            const { userId } = ctx.req.currentUser
            const picture = `${uuidv4()}-${Date.now()}.${mimetype.split('/')[1]}`
            createReadStream()
                .pipe(createWriteStream(join(resolve("./public"), picture)))
                .on("finish", () => { Logger.info('Images saved in Public Dir') })
            
            
            const photo = await this.userService.updatePhoto(picture, userId)
            return { message: "Photo Updated", photo}
    }

    @Mutation(() => CreateUserDto)
    async createUser(
        @Arg("body") data: SignUpInput
        ) {
            const user = await this.userService.register(data)
            return { message: "User Created", user}
    }


    @Mutation(() => UpdateUserDto)
    @UseMiddleware(AuthMiddleware)
    async updateUser(
        @Arg('body') body: UpdateInput, 
        @Ctx() ctx: Context<ExpressContext>
        ) {
            const { userId } = ctx.req.currentUser            
            const { user, profile } = UpdateUserClean(body)
            const {updatedUser, updatedProfile} = await this.userService.update({id: userId}, user, profile)
            return { message: "User Updated", user: updatedUser, profile: updatedProfile}
    }   
    
    @Query(() => UserDto)
    @UseMiddleware(AuthMiddleware)
    async getUser(@Ctx() ctx: Context<ExpressContext>){
        const { userId } = ctx.req.currentUser
        const { user, profile } = await this.userService.findOne({id: userId})
        return { message: "Current User", user, profile }
    }
    
} 
