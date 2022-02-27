import ProfileEntity from '@user/entity/profile.entity';
import { IProfile } from '@user/interfaces/profile.interface';
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(ProfileEntity)
export class ProfileRepository extends Repository<ProfileEntity>{
    // Create User Resource into Database
    async createProfile(body: object): Promise<ProfileEntity> {
        try {
            const profile = this.create(body);
            // save db instance
            await this.save(profile);
            return profile;
        } 
        catch (err) { throw err }
    }

    // Update User Resource
    async updateProfile(query: any, body: IProfile): Promise<void>{
        try{ 
            // finds one or fails if not available
            const profile = await this.findOneOrFail({ where: query})
            // merge found fields with existing fields
            this.merge(profile, body)
            await this.save(profile)
        }
        catch(err){ throw err }

    }
}
