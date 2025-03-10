import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Session } from 'src/auth/entities/auth.entity';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';
import { BullModule } from '@nestjs/bullmq';
import { ChatProcessor } from './consumer.chat';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, Session, ChatSession]),
    BullModule.registerQueue({
      name: '1v1Chat',
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatProcessor, ChatGateway],
})
export class ChatMessageModule {}
