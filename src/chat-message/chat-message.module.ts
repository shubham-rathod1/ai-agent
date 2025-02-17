import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Session } from 'src/auth/entities/auth.entity';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage,Session,ChatSession])],
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
})
export class ChatMessageModule {}