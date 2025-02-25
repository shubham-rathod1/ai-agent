import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as FormData from 'form-data';
import * as mammoth from 'mammoth';
import { KnowledgeBase } from '../agent/entities/kb.entity';
import { AgentService } from 'src/agent/agent.service';
import { KbTypes } from 'src/helper/enums';
import axios from 'axios';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepo: Repository<KnowledgeBase>,
    private readonly aService: AgentService,
  ) {}

  private baseUrl = 'https://generation.audiolibrary.ai/sona/kb';

  async uploadPdf(id: string, file: Express.Multer.File) {
    const res = await this.upload(id, file);
    return res;
  }

  async uploadUrl(id: string, url: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/documents/url/`, {
        url: url,
        knowledge_base_id: id,
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteKb(dId: string) {
    const response = await axios.delete(`${this.baseUrl}/api/documents/`, {
      params: {
        document_id: dId,
      },
    });
    return response.data;
  }

  async findKbByKid(id: string) {
    const response = await axios.get(`${this.baseUrl}/api/documents/`, {
      params: {
        knowledge_base_id: id,
      },
    });
    return response.data;
  }

  private async upload(kbId: string, file: Express.Multer.File) {
    const formData = new FormData();
    if(!file) throw new BadRequestException("unsupported or bad file sent!")
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('knowledge_base_id', kbId);

    file.buffer,
      {
        filename: file.originalname,
        contentType: file.mimetype,
      };

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/documents/pdf/`,
        formData,
        {
          headers: formData.getHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

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
}
