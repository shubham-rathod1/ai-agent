import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { ChatMessage, ChatRole } from './entities/chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessageService } from './chat-message.service';
// import axios from 'axios';

@Processor('1v1Chat')
export class ChatProcessor extends WorkerHost {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    private readonly chatService: ChatMessageService,
  ) {
    super();
    console.log('ChatProcessor Worker started!');
  }
  async process(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'pChat': {
        const {
          cSessionId,
          pId,
          history,
          kbId,
          persona,
          name,
          action,
          model_id,
          search_engine_id,
        } = job.data;

        try {
          const response = await this.chatService.aiResponse(
            cSessionId,
            pId,
            history,
            kbId,
            persona,
            name,
            action,
            model_id,
            search_engine_id,
          );
          const res = response.data;

          const cntnt = history[history.length - 1];
          const msg = this.chatRepo.create({
            cSessionId,
            pId,
            role: ChatRole.USER,
            message: cntnt.content,
          });
          await this.chatRepo.save(msg);
          const aiResp = this.chatRepo.create({
            cSessionId,
            pId: msg.id,
            role: ChatRole.ASSISTANT,
            message: res.response,
          });
          await this.chatRepo.save(aiResp);

          cSessionId &&
            this.chatService.sendMessage(cSessionId, aiResp.id, res.response);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
