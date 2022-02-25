import { verify } from 'argon2'
import { getCustomRepository } from 'typeorm'
// import { IPassword, IReturnUser, IUser } from '../interfaces/user.interface'
import { UserRepository } from '../repository/user.repository'
// import { InternalError, NotFoundError, UnauthorizedError } from '@utils/error-response.util'
// import { ILogin } from '@modules/auth/interfaces/auth.interface'
// import { FullUser } from '../user.types'
import UserEntity from '../entity/user.entity'
import { ForbiddenError } from 'apollo-server-express'
import { UpdatePassword, User } from '@user/interfaces/user.interface'

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

    async findCurrentUser(data: Partial<User>): Promise<UserEntity>{
        const user = await this.findOne(data)
        return user
    }

    async findOne(query: Partial<User>): Promise<UserEntity>{
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw err }
    }

    async update(query: Partial<User>, body: Partial<Omit<User, 'id'>>): Promise<Omit<UserEntity, 'password'>> {
        const user = await this.userRepository.updateUser(query, body)
        delete user.password
        return user
    }

    async updatePassword(query: Partial<User>, body: UpdatePassword): Promise<Omit<UserEntity, 'password'>>{
        const { oldPassword, newPassword } = body
        const user = await this.findOne(query)
        const validate = await this.validateLoginCredentials(user, oldPassword)
        if(!validate) throw new ForbiddenError("Username or Password incorrect")
        return await this.update(query, {password: newPassword})
    }

    async validateLoginCredentials(user: Pick<UserEntity, 'password'>, password: string):Promise<Boolean>{
        try{
            if(user.password) return await verify(user.password, password)
            else throw 'No Password Provided'
        }
        catch(err){throw err}
    }
}