import { ConflictException, Injectable } from '@nestjs/common';
import { CreateChatSessionDto } from './dto/chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly cSessionRepos: Repository<ChatSession>,
  ) {}
  async create(uId: string, createChatSession: CreateChatSessionDto) {
    const { aId } = createChatSession;
    const cSession = await this.cSessionRepos.findOne({ where: { aId, uId } });
    if (cSession) throw new ConflictException('session already exists!');
    const chatSession = this.cSessionRepos.create({
      uId,
      ...createChatSession,
    });
    console.log(chatSession);
    return await this.cSessionRepos.save(chatSession);
  }

  async findAll(uId: string, aId: string) {
    return await this.cSessionRepos.find({ where: { uId, aId } });
  }

  findOne(id: number) {
    return `This action returns a #${id} chatSession`;
  }

  update(id: number, updateChatSessionDto: UpdateChatSessionDto) {
    return `This action updates a #${id} chatSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatSession`;
  }
}
