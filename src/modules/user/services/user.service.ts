import { verify } from 'argon2'
import { getCustomRepository } from 'typeorm'
import { Service } from "typedi";

import { UserRepository } from '../repository/user.repository'
import UserEntity from '../entity/user.entity'
import { FullUser, IUser } from '@user/interfaces/user.interface'
import { IProfile } from '@user/interfaces/profile.interface';
import { ProfileRepository } from '@user/repository/profile.repository';
import ProfileEntity from '@user/entity/profile.entity';

@Service()
export default class UserService {
    public userRepository: UserRepository
    public profileRepository: ProfileRepository
    constructor(){
        this.userRepository = getCustomRepository(UserRepository)
        this.profileRepository = getCustomRepository(ProfileRepository)
    }

    async register(user: IUser, profile: IProfile): Promise<{newUser: Partial<UserEntity>, newProfile: ProfileEntity}>{
        const newProfile = await this.profileRepository.createProfile(profile)
        const newUser = await this.userRepository.createUser({user, profile:newProfile})
        delete newUser.profile
        delete newUser.password
        return {newUser, newProfile}
        
    }

    async findOne(query: Partial<FullUser>): Promise<UserEntity>{
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw err }
    }

    async update(query: Partial<FullUser>, user: IUser, profile: IProfile): Promise<{updatedUser: Partial<UserEntity>, updatedProfile: ProfileEntity | undefined}> {
        const updatedUser = await this.userRepository.updateUser(query, {user, profile})
        const updatedProfile = updatedUser.profile
        delete updatedUser.profile
        delete updatedUser.password
        return {updatedUser, updatedProfile}
    }

    async validateLoginCredentials(user: Pick<UserEntity, 'password'>, password: string):Promise<Boolean>{
        try{
            if(user.password) return await verify(user.password, password)
            else throw 'No Password Provided'
        }
        catch(err){throw err}
    }
}