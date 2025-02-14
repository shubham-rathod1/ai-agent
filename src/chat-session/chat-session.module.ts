import { Module } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { ChatSessionController } from './chat-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { Session } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, Session])],
  controllers: [ChatSessionController],
  providers: [ChatSessionService],
})
export class ChatSessionModule {}
