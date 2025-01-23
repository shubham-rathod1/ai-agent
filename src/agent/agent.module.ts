import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { KnowledgeBaseService } from 'src/upload/kb.service';
import { KnowledgeBase } from './entities/kb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent,KnowledgeBase])],
  controllers: [AgentController],
  providers: [AgentService,KnowledgeBaseService],
})
export class AgentModule {}
