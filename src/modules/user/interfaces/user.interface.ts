export interface User {
    username: string;
    email: string;
    firstname: string;
    surname: string;
    password: string;
    phone: string
    bio: string
}

export interface FullUser {
    id?: string;
    username?: string;
    email?: string;
    firstname?: string;
    surname?: string;
    confirmTokenPassword?:string
    bio?: string
    phone?: string 
    password?: string
    created_at?: string
    updated_at?: string
}

export type safeFullUser = Omit<FullUser, 'password'>

export interface UpdatePassword{
    oldPassword: string,
    newPassword: string
}
