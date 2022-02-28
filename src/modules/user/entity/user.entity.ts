import { Field, ObjectType } from 'type-graphql'
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    BaseEntity, 
    Unique, 
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn
} from 'typeorm'
import ProfileEntity from './profile.entity'

@ObjectType()
@Entity({name: "users"})
@Unique('UQ_USER_EMAIL', ['email'])
export default class UserEntity extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field({nullable: true})
    @Column({nullable: true})
    username?: string

    @Field({nullable: true})
    @Column({nullable: true})
    name?: string

    @Field()
    @Column()
    email: string

    @Field({nullable: true})
    @Column()
    password?: string

    @Field()
    @Column('text', { nullable: true })
    confirmTokenPassword?: string;

    @Field()
    @OneToOne(() => ProfileEntity, profile => profile.user)
    @JoinColumn()
    profile?: ProfileEntity;

    @Field()
    @CreateDateColumn()
    created_at: Date;

    @Field()
    @UpdateDateColumn()
    updated_at: Date;
}