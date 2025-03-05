import { ConflictException, Injectable } from '@nestjs/common';
import { instanceDto } from './dto/grp-message.dto';
// import { UpdateGrpMessageDto } from './dto/update-grp-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GrpMessage } from './entities/grp-message.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { GrpInstance } from './entities/grp-instance.entity';

@Injectable()
export class GrpMessageService {
  private clients = new Map<number, Response[]>(); // Store active SSE connections

  constructor(
    @InjectRepository(GrpMessage)
    private readonly messageRepository: Repository<GrpMessage>,
    @InjectRepository(GrpInstance)
    private readonly instanceRepository: Repository<GrpInstance>,
  ) {}

  async create(
    senderAddress: string,
    instanceId: number,
    content: string,
    hash?: string,
    amnt?: string,
  ): Promise<GrpMessage> {
    const message = this.messageRepository.create({
      senderAddress,
      instanceId,
      content,
      hash,
      amnt,
    });
    const aiResp = await this.aiResponse(content);
    console.log('aiResp', aiResp);
    this.sendResponse(instanceId, aiResp);
    return await this.messageRepository.save(message);
  }

  async aiResponse(content: any) {
    console.log('did this run!');
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
              name: 'shinobi',
              persona:
                'you are an shinobi, master in marital arts and assissanication skills',
            },
            enable_action: true,
            model_id: 'gpt-4o-mini',
            search_engine_id: null,
            knowledge_base_id: null,
            messages: [
              {
                role: 'user',
                name: 'mangesh',
                content,
              },
            ],
          }),
        },
      );
      const res = await response.json();
      console.log('res from airesponse', res);
      return res.response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  subscribe(instanceId: number, res: Response) {
    if (!this.clients.has(instanceId)) {
      this.clients.set(instanceId, []);
    }
    this.clients.get(instanceId).push(res);

    res.on('close', () => {
      this.clients.set(
        instanceId,
        this.clients.get(instanceId).filter((client) => client !== res),
      );
      res.end();
    });
  }

  sendResponse(instanceId: number, message: string) {
    console.log('before sending', instanceId, message);
    const clients = this.clients.get(instanceId);
    if (clients) {
      clients.forEach((res) => {
        res.write(`data: ${JSON.stringify({ response: message })}\n\n`);
      });
    }
  }

  async createInstance(instance: any): Promise<GrpInstance> {
    const extInst = await this.findOneInstance(instance.aId);
    if (extInst) throw new ConflictException('instance already exists!');
    const inst = this.instanceRepository.create(instance) as any;
    return this.instanceRepository.save(inst);
  }

  findAll() {
    return `This action returns all grpMessage`;
  }

  async findOneInstance(aId: string) {
    console.log('from service', aId);
    const instanc = await this.instanceRepository.findOneBy({ aId });
    console.log('instance', instanc);
    return instanc;
    // return `This action returns a #${id} grpMessage`;
  }

  // update(id: number, updateGrpMessageDto: UpdateGrpMessageDto) {
  //   return `This action updates a #${id} grpMessage`;
  // }

  remove(id: number) {
    return `This action removes a #${id} grpMessage`;
  }
}
