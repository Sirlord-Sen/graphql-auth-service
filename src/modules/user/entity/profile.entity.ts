import { Field, ObjectType } from 'type-graphql'
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    BaseEntity, 
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne
} from 'typeorm'
import UserEntity from './user.entity'

@ObjectType()
@Entity({name: "profile"})
export default class ProfileEntity extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field({nullable: true})
    @Column({nullable: true})
    bio?: string

    @Field({nullable: true})
    @Column({nullable: true})
    phone?: string

    @Field({nullable: true})
    @Column({nullable: true})
    picture?: string

    @OneToOne(() => UserEntity, user => user.profile)
    user: UserEntity;

    @Field()
    @CreateDateColumn()
    created_at: Date;

    @Field()
    @UpdateDateColumn()
    updated_at: Date;
}