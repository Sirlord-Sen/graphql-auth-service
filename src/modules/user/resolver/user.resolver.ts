import { Arg, Mutation, Query, Resolver } from 'type-graphql'

@Resolver()
export class UserResolver{
    constructor(){
    }

    @Query(() => String)
    hello(){
        return 'hello world'
    }
    
} 