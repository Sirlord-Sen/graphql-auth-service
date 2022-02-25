import { Field, ObjectType } from 'type-graphql'
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    BaseEntity, 
    Unique, 
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm'

@ObjectType()
@Entity({name: "users"})
@Unique('UQ_USER_EMAIL', ['email'])
export default class UserEntity extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field()
    @Column()
    username: string

    @Field()
    @Column()
    firstname: string

    @Field()
    @Column()
    surname: string

    @Field()
    @Column()
    email: string

    @Column()
    password: string

    @Field()
    @Column()
    bio?: string

    @Field()
    @Column()
    phone: string

    @Field()
    @Column('text', { nullable: true })
    confirmTokenPassword?: string;

    @Field()
    @CreateDateColumn()
    created_at: Date;

    @Field()
    @UpdateDateColumn()
    updated_at: Date;
}