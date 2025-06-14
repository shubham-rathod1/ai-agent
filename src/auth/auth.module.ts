import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Session } from './entities/auth.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Auth]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
