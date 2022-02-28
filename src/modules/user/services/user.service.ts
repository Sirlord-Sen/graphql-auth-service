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

    async register(user: Partial<IUser>): Promise<Partial<UserEntity>>{
        const profile = await this.profileRepository.createProfile({})
        const newUser = await this.userRepository.createUser(user, profile)
        delete newUser.profile
        delete newUser.password
        return newUser
        
    }

    async findOne(query: Partial<FullUser>): Promise<{
        user: Partial<UserEntity>, 
        profile: ProfileEntity | undefined
        }> {
        try{ 
            const user = await this.userRepository.findOneOrFail({ where: query , relations: ["profile"] })
            const profile = user.profile
            delete user.profile
            return {user, profile}
        }
        catch(err){ throw err }
    }

    async update(
        query: Partial<FullUser>, 
        user: IUser, 
        profile: IProfile): Promise<{
            updatedUser: Partial<UserEntity>, 
            updatedProfile: ProfileEntity | undefined
        }> {
        const updatedUser = await this.userRepository.updateUser(query, {user, profile})
        const updatedProfile = updatedUser.profile
        delete updatedUser.profile
        return {updatedUser, updatedProfile}
    }

    async updatePhoto(picture: string, id: string): Promise<string | undefined> {
        try{
            const user = await this.userRepository.findOneOrFail({ where: {id: id} , relations: ["profile"] })
            const updatedPhoto = await this.profileRepository.updateProfile({id: user.profile?.id}, {picture})
            return updatedPhoto.picture
        }
        catch(err){ throw err }
    }

    async validateLoginCredentials(user: Pick<UserEntity, 'password'>, password: string):Promise<Boolean>{
        try{
            if(user.password) return await verify(user.password, password)
            else throw 'No Password Provided'
        }
        catch(err){throw err}
    }
}