import { verify } from 'argon2'
import { getCustomRepository } from 'typeorm'
import { Service } from "typedi";

import { UserRepository } from '../repository/user.repository'
import UserEntity from '../entity/user.entity'
import { FullUser } from '@user/interfaces/user.interface'

@Service()
export default class UserService {
    public userRepository: UserRepository
    constructor(){
        this.userRepository = getCustomRepository(UserRepository)
    }

    async register(data: any): Promise<UserEntity>{
        try{
            const newUser = await this.userRepository.createUser(data)
            return newUser
        }
        catch(err){ throw err }
    }

    async findOne(query: Partial<FullUser>): Promise<UserEntity>{
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw err }
    }

    async update(query: Partial<FullUser>, body: Partial<Omit<FullUser, 'id'>>): Promise<UserEntity> {
        const user = await this.userRepository.updateUser(query, body)
        delete user.password
        return user
    }

    async validateLoginCredentials(user: Pick<UserEntity, 'password'>, password: string):Promise<Boolean>{
        try{
            if(user.password) return await verify(user.password, password)
            else throw 'No Password Provided'
        }
        catch(err){throw err}
    }
}