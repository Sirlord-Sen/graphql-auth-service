import { verify } from 'argon2'
import { getCustomRepository } from 'typeorm'
// import { IPassword, IReturnUser, IUser } from '../interfaces/user.interface'
import { UserRepository } from '../repository/user.repository'
// import { InternalError, NotFoundError, UnauthorizedError } from '@utils/error-response.util'
// import { ILogin } from '@modules/auth/interfaces/auth.interface'
// import { FullUser } from '../user.types'
import UserEntity from '../entity/user.entity'

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

    // async findCurrentUser(data: Partial<FullUser>): Promise<IReturnUser>{
    //     const user = await this.findOne(data)
    //     return pick(user, ["id", "username", "email", "firstname", "surname"])
    // }
    // async findOne(query: Partial<FullUser>): Promise<UserEntity>{
    //     try{ return await this.userRepository.findOneOrFail({ where: query });}
    //     catch(err){ throw new NotFoundError("User not found").send() }
    // }

    // async update(query: Partial<FullUser>, body: Partial<Omit<FullUser, 'id'>>): Promise<IReturnUser> {
    //     const user = await this.userRepository.updateUser(query, body)
    //     return pick(user, ["id", "username", "email", "firstname", "surname"])
    // }

    // async updatePassword(query: Partial<FullUser>, body: IPassword): Promise<IReturnUser>{
    //     const { oldPassword, newPassword } = body
    //     const user = await this.findOne(query)
    //     const validate = await this.validateLoginCredentials(user, oldPassword)
    //     if(!validate) throw new UnauthorizedError("Invalid Login Credentials").send()
    //     return await this.update(query, {password: newPassword})
    // }

    // async validateLoginCredentials(user: Pick<ILogin, 'password'>, password: string):Promise<Boolean>{
    //     try{return await verify(user.password, password)}
    //     catch(err){throw new InternalError("Could not verify Password").send()}
    // }
}