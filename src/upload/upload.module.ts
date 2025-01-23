import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeBase } from 'src/agent/entities/kb.entity';
import { KnowledgeBaseService } from './kb.service';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBase])],
  controllers: [UploadController],
  providers: [UploadService, KnowledgeBaseService],
})
export class UploadModule {}
