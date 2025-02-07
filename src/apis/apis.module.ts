import { Module } from '@nestjs/common';
import { ApiKeyService } from './apis.service';
import { ApiKeyController } from './apis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './entity/api.entity';
import { User } from 'src/users/entities/user.entity';
import { Session } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, User, Session])],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class ApiKeyModule {}
