import { EntityRepository, Repository } from 'typeorm'

import UserEntity from '../entity/user.entity'

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{
    // Create User Resource into Database
    async createUser(body: object): Promise<UserEntity> {
        try {
            const user = this.create(body);
            // save db instance
            await this.save(user);
            return user;
        } 
        catch (err) { throw err }
    }

    // Update User Resource
    async updateUser(query: any, body: any): Promise<UserEntity>{
        try{ 
            // finds one or fails if not available
            const user = await this.findOneOrFail({ where: query})
            // merge found fields with existing fields
            this.merge(user, body)
            await this.save(user)
            return user
        }
        catch(err){ throw err }

    }
}
