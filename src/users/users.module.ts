import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from 'src/agent/entities/agent.entity';
import { User } from './entities/user.entity';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, User, ChatSession])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
