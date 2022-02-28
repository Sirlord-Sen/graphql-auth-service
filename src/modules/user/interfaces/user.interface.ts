import ProfileEntity from "@user/entity/profile.entity";
import { IProfile } from "./profile.interface";

export interface User {
    username: string;
    email: string;
    firstname: string;
    surname: string;
    password: string;
    phone: string
    bio: string
}

export interface IUser {
    username: string | undefined
    email: string | undefined
    password: string | undefined
    name: string | undefined
}

export interface saveUser{
    user: IUser
    profile: ProfileEntity
}

export interface FullUser {
    id?: string;
    username?: string;
    email?: string;
    firstname?: string;
    surname?: string;
    picture?: string
    confirmTokenPassword?:string
    bio?: string
    phone?: string 
    password?: string
}

export interface UpdateUser{
    user: Partial<IUser>, 
    profile: Partial<IProfile>
}

export type safeFullUser = Omit<FullUser, 'password'>

export interface UpdatePassword{
    oldPassword: string,
    newPassword: string
}
