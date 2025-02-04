import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { KnowledgeBase } from '../agent/entities/kb.entity';
import { AgentService } from 'src/agent/agent.service';
import { KbTypes } from 'src/helper/enums';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepo: Repository<KnowledgeBase>,
    private readonly aService: AgentService,
  ) {}

  async processFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<KnowledgeBase> {
    try {
      let content = '';
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        content = data.text;
      } else if (file.mimetype === 'text/plain') {
        content = file.buffer.toString('utf-8');
      } else if (
        file.mimetype === 'application/msword' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        content = result.value;
      } else {
        throw new Error('Unsupported file type');
      }
      const agent = await this.aService.findOne(id);
      if (!agent) {
        throw new NotFoundException('Agent Not Found!');
      }
      const knowledge = this.knowledgeBaseRepo.create({
        aId: id,
        filename: file.originalname,
        typ: KbTypes.FILE,
        content,
      });
      return await this.knowledgeBaseRepo.save(knowledge);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async uploadTxt(id: string, content: string): Promise<KnowledgeBase> {
    const agent = await this.aService.findOne(id);
    console.log(id);
    if (!agent) {
      throw new NotFoundException('Agent Not Found!');
    }
    const knowledge = this.knowledgeBaseRepo.create({
      aId: id,
      filename: content.substring(0, 10),
      typ: KbTypes.TEXT,
      content,
    });
    return await this.knowledgeBaseRepo.save(knowledge);
  }

  async deleteKb(id: string, kbID: number[]) {
    console.log(id, kbID);
    const agent = await this.aService.findOne(id);
    if (!agent) {
      throw new NotFoundException('Agent Not Found!');
    }
    const existingItems = await this.knowledgeBaseRepo.find({
      where: { id: In(kbID) },
    });
    console.log(existingItems, 'existing items');
    if (existingItems.length > 0) {
      await this.knowledgeBaseRepo.remove(existingItems);
    }
  }

  async findKbById(id: string) {
    return await this.knowledgeBaseRepo.find({ where: { aId: id } });
  }
}
