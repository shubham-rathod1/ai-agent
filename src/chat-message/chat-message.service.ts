import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatMessageDto } from './dto/chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage, ChatRole } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Worker } from 'bullmq';
import { Response } from 'express';
import axios from 'axios';
import { BrowserType, ModelId } from 'src/helper/enums';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectQueue('1v1Chat') private readonly pQueue: Queue,
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    @InjectRepository(ChatSession)
    private readonly cSessionRepos: Repository<ChatSession>,
  ) {}
  private clients = new Map<string, Set<Response>>();
  async create(uId: string, createChatMessage: any) {
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
      this.pQueue.on('waiting', (jobId) => {
        console.log(`Job ${jobId} is waiting to be processed`);
      });
      this.pQueue.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      this.pQueue.on('removed', () => {
        console.error('Redis Client Disconnected');
      });
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

  async subscribe(sessionId: string, res: Response, uId: string) {
    try {
      const sess = await this.cSessionRepos.findOne({
        where: { id: sessionId },
      });
      console.log('sess', sess);
      if (!sess) {
        throw new NotFoundException('session not found'!);
      }
      if (sess.uId !== uId)
        throw new UnauthorizedException(
          'You are not authorized to join this session!',
        );
      if (!this.clients.has(sessionId)) {
        this.clients.set(sessionId, new Set<Response>());
      }
      this.clients.get(sessionId)!.add(res);
      res.write(`data: ${JSON.stringify({ message: 'Connected to SSE' })}\n\n`);

      res.on('close', () => {
        console.log(`Client disconnected from session: ${sessionId}`);
        this.clients.get(sessionId)?.delete(res);
        res.end();
      });
    } catch (error) {
      console.error('Subscription Error:', error);
      res.status(500).send({ error: 'Subscription failed' });
    }
  }

  sendMessage(sessionId: string, id: number, message: string) {
    const connection = this.clients.get(sessionId) as any;
    console.log('🔍 Debugging sendMessage:', { sessionId });
    if (!connection) {
      console.error(`❌ No active SSE client found for session: ${sessionId}`);
      return;
    }
    try {
      for (const res of connection) {
        try {
          res.write(`data: ${JSON.stringify({ response: message, id })}\n\n`);
          console.log('✅ Message sent:', message);
        } catch (error) {
          console.error('❌ Error writing to SSE client:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error writing to SSE client:', error);
    }
  }

  async aiResponse(
    cSessionId: string,
    pId: string,
    history: any,
    kbId: string,
    persona: string,
    name: string,
    action: boolean,
    model_id: ModelId,
    search_engine_id: BrowserType,
  ) {
    try {
      const response = await axios.post(
        'https://generation.audiolibrary.ai/sona/kb/api/chat/',
        {
          character: {
            name,
            persona,
          },
          enable_action: action,
          model_id,
          search_engine_id,
          knowledge_base_id: kbId,
          messages: history,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );
      console.log('axios response', response);
      return response;
      // const res = await response.json();
      // const cntnt = history[history.length - 1];
      // const msg = this.chatRepo.create({
      //   cSessionId,
      //   pId,
      //   role: ChatRole.USER,
      //   message: cntnt.content,
      // });
      // console.log(res);
      // await this.chatRepo.save(msg);
      // const resp = this.chatRepo.create({
      //   cSessionId,
      //   pId: msg.id,
      //   role: ChatRole.ASSISTANT,
      //   message: res.response,
      // });
      // await this.chatRepo.save(resp);
      // return { ...res, chatId: resp.id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
