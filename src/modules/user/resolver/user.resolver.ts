import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from 'fs';
import { join, resolve } from 'path';
import { Logger } from '@utils/logger.util';
import { v4 as uuidv4 } from 'uuid';
import UserEntity from '@user/entity/user.entity';
import UserService from '@user/services/user.service';
import { SignUpInput } from '@user/inputs/user.input';
import { Service } from 'typedi'
import { Context } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { AuthMiddleware } from '@middlewares/auth.middleware';

@Service()
@Resolver()
export class UserResolver{
    constructor(
        private readonly userService: UserService
    )
    {}

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

    @Mutation(() => UserEntity)
    async createUser(@Arg("body") body: SignUpInput){
        const user = await this.userService.register(body)
        return user
    }

    @Mutation(() => UserEntity)
    @UseMiddleware(AuthMiddleware)
    async updateUser(@Arg('body') body: SignUpInput, @Ctx() ctx: Context<ExpressContext>) {
        const { userId } = ctx.req.currentUser
        const user = await this.userService.update({id: userId}, body)
        return user
    }    
    
} 