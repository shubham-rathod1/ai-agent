import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { KnowledgeBase } from '../agent/entities/kb.entity';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepo: Repository<KnowledgeBase>,
  ) {}

  async processFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<KnowledgeBase> {
    let content = '';

    // Handle different file types
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      content = data.text;
      // console.log("data",data)
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

    // Save to DB
    const knowledge = this.knowledgeBaseRepo.create({
      aId: id,
      filename: file.originalname,
      content,
    });
    return await this.knowledgeBaseRepo.save(knowledge);
  }

  async findKbById(id: string) {
    return await this.knowledgeBaseRepo.find({ where: { aId: id } });
  }
}
