import UserService from "@user/services/user.service";
import TokenService from "./token.service";
import { IRefreshToken, ITokenResponse } from "../interfaces/token.interface";
import { TokenType } from "@utils/util-types";
import { nanoid } from "nanoid";
import { Service } from 'typedi'
import UserEntity from "@user/entity/user.entity";
import { ILogin, ILogout } from "@auth/interfaces/auth.interface";

@Service()
export default class AuthService {

    constructor(
        private userService: UserService ,
        private tokenService: TokenService
    ){
    }

    async login(body:ILogin): Promise<UserEntity>{
        const { email, password } = body
        const user = await this.userService.findOne({email})
        const validate = await this.userService.validateLoginCredentials(user, password)
        if(!validate) throw new Error("Invalid Login Credentials")
        return user    
    }

    async logout(body:ILogout): Promise<void>{
        await this.tokenService.update({...body }, {isRevoked: true });
    }

    async refreshToken(body: IRefreshToken): Promise<ITokenResponse>{
        let { id, email }  = await this.tokenService.resolveRefreshToken(body.refreshToken)
        const { accessToken, expiredAt } = await this.tokenService.generateAccessToken({userId: id, email })
        const tokens = { tokenType: TokenType.BEARER , accessToken, expiredAt, refreshToken: body.refreshToken }
        return  tokens ;
    }
}