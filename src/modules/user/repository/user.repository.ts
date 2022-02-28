import ProfileEntity from '@user/entity/profile.entity';
import { FullUser, IUser, saveUser, UpdateUser } from '@user/interfaces/user.interface';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm'

import UserEntity from '../entity/user.entity'
import { ProfileRepository } from './profile.repository';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{
    private profileRepository: ProfileRepository
    constructor(){
        super()
        this.profileRepository = getCustomRepository(ProfileRepository)
    }
    // Create User Resource into Database
    async createUser(user: Partial<IUser>, profile: ProfileEntity): Promise<UserEntity> {
        try {
            const newUser = this.create(user);
            newUser.profile = profile
            // save db instance
            await this.save(newUser);
            return newUser;
        } 
        catch (err) { throw err }
    }

    // Update User Resource
    async updateUser(query: Partial<FullUser>, body: UpdateUser): Promise<UserEntity>{
        try{ 
            // finds one or fails if not available
            const findUser = await this.findOneOrFail({ where: query, relations: ["profile"] })
            const id = findUser.profile?.id
            await this.profileRepository.updateProfile({id: id}, body.profile)
            const user = await this.findOneOrFail({ where: query, relations: ["profile"] })
            // merge found fields with existing fields
            this.merge(user, body.user)
            await this.save(user)
            return user
        }
        catch(err){ throw err }
    }
}
