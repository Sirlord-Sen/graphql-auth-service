export interface ILogin {
    password: string
    email: string
}

export interface ILogout {
    userId: string,
    os?: string,
    browser?: string
}