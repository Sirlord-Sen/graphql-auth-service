import { EntityRepository, Repository } from 'typeorm';
import RefreshTokenEntity  from '../entity/refreshToken.entity';
import { Logger } from '@utils/logger.util';
import { FullRefreshToken } from '@auth/interfaces/token.interface';

@EntityRepository(RefreshTokenEntity)
export default class RefreshTokenRepository extends Repository<RefreshTokenEntity> {

    async createRefreshToken(body: object): Promise<RefreshTokenEntity> {
        try{
            const token = this.create(body);
            await this.save(token);
            return token
        }
        catch(err){ throw err }
  }

    async findOneToken( query:Partial<FullRefreshToken>): Promise<RefreshTokenEntity> {
        try{ return await this.findOneOrFail({ where: query }); }
        catch(err){ throw err }
    }

    async updateRefreshToken( query: any, body: any ): Promise<void> {
        try{ 
            const refreshToken = await this.findOneOrFail({where: query})
            // When client has access to a revoked refresh token
            if (refreshToken.isRevoked) Logger.warn("POTENTIAL THREAT: User in posession of Revoked RefreshToken")
            this.merge(refreshToken, body)
            await this.save(refreshToken) 
        }
        catch(err){ throw err }
    }
}