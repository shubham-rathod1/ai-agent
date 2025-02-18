import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Session } from 'src/auth/entities/auth.entity';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';
import { BullModule } from '@nestjs/bullmq';
import { ChatProcessor } from './consumer.chat';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, Session, ChatSession]),
    BullModule.registerQueue({
      name: '1v1Chat',
    }),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService,ChatProcessor],
})
export class ChatMessageModule {}
