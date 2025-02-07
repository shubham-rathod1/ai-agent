import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { KnowledgeBaseService } from 'src/upload/kb.service';
import { KnowledgeBase } from './entities/kb.entity';
import { Session } from 'src/auth/entities/auth.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiKey } from 'src/apis/entity/api.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, KnowledgeBase, Session, User,ApiKey])],
  controllers: [AgentController],
  providers: [AgentService, KnowledgeBaseService],
})
export class AgentModule {}
