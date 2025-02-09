import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../apis/entity/api.entity';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKey>,
    @InjectRepository(User)
    private uRepo: Repository<User>,
  ) {}

  async generateApiKey(userId: string) {
    const user = await this.uRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const newKey = this.apiKeyRepo.create({ uId: user.id });
    newKey.key = crypto.randomBytes(32).toString('hex');

    return this.apiKeyRepo.save(newKey);
  }

  async getUserKeys(userId: string) {
    return this.apiKeyRepo.find({ where: { user: { id: userId } } });
  }

  async deactivateApiKey(userId: string, keyId: number) {
    const key = await this.apiKeyRepo.findOne({
      where: { id: keyId, user: { id: userId } },
    });
    if (!key) throw new UnauthorizedException('Key not found');

    key.active = false;
    return this.apiKeyRepo.save(key);
  }
}
