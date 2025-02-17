import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage, ChatRole } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { ChatSession } from 'src/chat-session/entities/chat-session.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    @InjectRepository(ChatSession)
    private readonly cSessionRepos: Repository<ChatSession>,
  ) {}
  async create(uId: string, createChatMessage: any) {
    console.log(createChatMessage);
    const { cSessionId, pId, history } = createChatMessage;
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
            knowledge_base_id: '1',
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
}
