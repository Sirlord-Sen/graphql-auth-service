import { verify, hash } from 'argon2'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import UserEntity  from '../entity/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {

    beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
        return this.hashPassword(event.entity);
    }

    async beforeUpdate({entity, databaseEntity}: UpdateEvent<UserEntity>): Promise<void> {
        //Checks if the password field exist
        if (entity?.password && databaseEntity.password){
            // Check if Password is not the same
            if(entity?.password !== databaseEntity?.password && !(await verify(databaseEntity.password, entity?.password))){
                await this.hashPassword(entity as UserEntity);  
            }
            else entity.password = databaseEntity.password;
            entity.confirmTokenPassword = ''
        }
    }

    async hashPassword(entity: UserEntity): Promise<void> {
        if (entity.password) entity.password = await hash(entity.password)
    }

    listenTo() {
        return UserEntity;
    }
}