import { Injectable } from '@nestjs/common';
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
    this.sendResponse(
      instanceId,
      `this is the message from ${instanceId} at timestamp ${Date.now}`,
    );
    return await this.messageRepository.save(message);
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
    const clients = this.clients.get(instanceId);
    if (clients) {
      clients.forEach((res) => {
        res.write(`data: ${JSON.stringify({ response: message })}\n\n`);
      });
    }
  }

  async createInstance(instance: any): Promise<GrpInstance> {
    const inst = this.instanceRepository.create(instance) as any;
    return this.instanceRepository.save(inst);
  }

  findAll() {
    return `This action returns all grpMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grpMessage`;
  }

  // update(id: number, updateGrpMessageDto: UpdateGrpMessageDto) {
  //   return `This action updates a #${id} grpMessage`;
  // }

  remove(id: number) {
    return `This action removes a #${id} grpMessage`;
  }
}
