import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage, ChatRole } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { Response } from 'express';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectQueue('1v1Chat') private readonly pQueue: Queue,
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    @InjectRepository(ChatSession)
    private readonly cSessionRepos: Repository<ChatSession>,
  ) {}
  private clients = new Map<string, Response>();
  async create(uId: string, createChatMessage: any) {
    console.log(createChatMessage);
    const {
      cSessionId,
      pId,
      history,
      action,
      model_id,
      kbId,
      persona,
      name,
      search_engine_id,
    } = createChatMessage;
    // const queueEvents = new QueueEvents(this.pQueue);

    try {
      const job = await this.pQueue.add('pChat', {
        uId,
        cSessionId,
        pId,
        kbId,
        name,
        persona,
        history,
        action,
        model_id,
        search_engine_id,
      });
      // return await this.aiResponse(cSessionId,pId,history);
      // return { jobId: job.id, message: 'Processing started' };
      return { sessionId: cSessionId, message: 'Processing started' };
    } catch (error) {
      console.log(error);
    } finally {
      console.log(`chat added to the queue with pId ${pId}`);
    }
  }

  async findAll(cSessionId: string) {
    return await this.chatRepo.find({
      where: { cSessionId },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} chatMessage`;
  }

  update(id: number, updateChatMessageDto: UpdateChatMessageDto) {
    return `This action updates a #${id} chatMessage`;
  }

  async deleteHistory(cSessionId: string) {
    const cSession = await this.cSessionRepos.findOne({
      where: { id: cSessionId },
    });
    if (!cSession) {
      throw new NotFoundException('chat session not found!');
    }
    await this.chatRepo.delete({ cSessionId });
    return 'Session History deleted!';
  }

  subscribe(sessionId: string, res: Response) {
    this.clients.set(sessionId, res);

    // Remove connection on client disconnect
    res.on('close', () => {
      this.clients.delete(sessionId);
      res.end();
    });
  }

  sendMessage(sessionId: string, id: number, message: string) {
    const res = this.clients.get(sessionId);
    if (res) {
      res.write(`data: ${JSON.stringify({ response: message, id })}\n\n`);
    }
  }

  private async aiResponse(
    cSessionId: string,
    pId: number,
    history: any,
    aId: string,
    action: boolean,
    model_id: string,
    search_engine_id: string,
  ) {
    try {
      const response = await fetch(
        'https://generation.audiolibrary.ai/sona/kb/api/chat/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            character: {
              name: "Kaoru 'Stormblade' Takahashi",
              persona:
                'A fierce but honorable samurai from a post-apocalyptic world...',
            },
            enable_action: false,
            knowledge_base_id: null,
            model_id: 'llama-3.3-70b-versatile',
            search_engine_id: null,
            messages: history,
          }),
        },
      );
      const res = await response.json();
      const cntnt = history[history.length - 1];
      const msg = this.chatRepo.create({
        cSessionId,
        pId,
        role: ChatRole.USER,
        message: cntnt.content,
      });
      console.log(res);
      await this.chatRepo.save(msg);
      const resp = this.chatRepo.create({
        cSessionId,
        pId: msg.id,
        role: ChatRole.ASSISTANT,
        message: res.response,
      });
      await this.chatRepo.save(resp);
      return { ...res, chatId: resp.id };
    } catch (error) {
      console.log(error);
    }
  }
}
