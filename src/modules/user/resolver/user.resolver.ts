import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from 'fs';
import { join, resolve } from 'path';
import { Logger } from '@utils/logger.util';
import { v4 as uuidv4 } from 'uuid';

@Resolver()
export class UserResolver{
    constructor(){
    }

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
    
} 