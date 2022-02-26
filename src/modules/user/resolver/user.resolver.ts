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
import { SignUpInput } from '@user/inputs/user.input';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { CreateUserDto, UpdateUserDto } from '@user/dto/user.dto';

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

    
    @Mutation(() => Boolean)
    async singleUpload(
        @Arg("file", () => GraphQLUpload) { createReadStream, mimetype }: FileUpload
    ) {
        const profilePicture = `${uuidv4()}-${Date.now()}.${mimetype.split('/')[1]}`
        createReadStream()
            .pipe(createWriteStream(join(resolve("./public"), profilePicture)))
            .on("finish", () => { Logger.info('Images saved in Public Dir') })

        return true
    }

    @Mutation(() => CreateUserDto)
    async createUser(@Arg("body") body: SignUpInput){
        const user = await this.userService.register(body)
        return { message: "User Created", user}
    }

    @Mutation(() => UpdateUserDto)
    @UseMiddleware(AuthMiddleware)
    async updateUser(@Arg('body') body: SignUpInput, @Ctx() ctx: Context<ExpressContext>) {
        const { userId } = ctx.req.currentUser
        const user = await this.userService.update({id: userId}, body)
        return { message: "User Updated", user}
    }    
    
} 