import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeBase } from 'src/agent/entities/kb.entity';
import { KnowledgeBaseService } from './kb.service';
import { AgentService } from 'src/agent/agent.service';
import { Agent } from 'src/agent/entities/agent.entity';
import { Session } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBase, Agent, Session])],
  controllers: [UploadController],
  providers: [UploadService, KnowledgeBaseService, AgentService],
})
export class UploadModule {}
