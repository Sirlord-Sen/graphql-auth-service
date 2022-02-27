import { FullUser, saveUser, UpdateUser } from '@user/interfaces/user.interface';
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
    async createUser(body: saveUser): Promise<UserEntity> {
        try {
            const user = this.create(body.user);
            user.profile = body.profile
            // save db instance
            await this.save(user);
            return user;
        } 
        catch (err) { throw err }
    }

    // Update User Resource
    async updateUser(query: Partial<FullUser>, body: UpdateUser): Promise<UserEntity>{
        try{ 
            // finds one or fails if not available
            const user = await this.findOneOrFail({ where: query})
            const id = user.profile?.id
            await this.profileRepository.update({id: id}, body.profile)
            // merge found fields with existing fields
            this.merge(user, body.user)
            await this.save(user)
            return user
        }
        catch(err){ throw err }

    }
}
