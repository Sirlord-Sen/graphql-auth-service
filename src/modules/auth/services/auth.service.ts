import { Service } from 'typedi'

import UserService from "@user/services/user.service";
import TokenService from "./token.service";
import UserEntity from "@user/entity/user.entity";
import { ILogin, ILogout } from "@auth/interfaces/auth.interface";
import ProfileEntity from '@user/entity/profile.entity';

@Service()
export default class AuthService {

    constructor(
        private userService: UserService ,
        private tokenService: TokenService
    ){
    }

    async login(body:ILogin): Promise<{
        user: Partial<UserEntity>, 
        profile: ProfileEntity | undefined
        }>{
        const { email, password } = body
        const {user, profile} = await this.userService.findOne({email})
        const validate = await this.userService.validateLoginCredentials(user, password)
        if(!validate) throw new Error("Invalid Login Credentials")
        return {user, profile}    
    }

    async logout(body:ILogout): Promise<void>{
        await this.tokenService.update({...body, isRevoked: false }, {isRevoked: true });
    }

    // async refreshToken(body: IRefreshToken): Promise<RefreshTokenResponse>{
    //     let { id, email }  = await this.tokenService.resolveRefreshToken(body.refreshToken)
    //     const { accessToken, expiredAt } = await this.tokenService.generateAccessToken({userId: id, email })
    //     const tokens = { tokenType: TokenType.BEARER , accessToken, expiredAt, refreshToken: body.refreshToken }
    //     return  tokens ;
    // }
}