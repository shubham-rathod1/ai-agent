import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { ChatMessage, ChatRole } from './entities/chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatMessageService } from './chat-message.service';

@Processor('1v1Chat')
export class ChatProcessor extends WorkerHost {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    private readonly chatService: ChatMessageService,
    private readonly chatGateway: ChatGateway,
  ) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case 'pChat': {
        console.log('it ran from consumer');
        const { cSessionId, pId, history, uId } = job.data;
        // business logic here;
        // const { cSessionId, pId, history } = createChatMessage;
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
                  name: "Kaoru 'Stormblade' Takahashi",
                  persona:
                    'A fierce but honorable samurai from a post-apocalyptic world...',
                },
                enable_action: true,
                model_id: 'openai',
                search_engine_id: 'brave',
                knowledge_base_id: '1',
                messages: history,
              }),
            },
          );
          const res = await response.json();
          console.log('response from ai', res);

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

          // this.chatGateway.sendToUser(uId, 'chatResponse', {
          //   chatId: aiResp.id,
          //   response: res.response,
          // });
          this.chatService.sendMessage(cSessionId,aiResp.id, res.response);

          // return { ...res, chatId: resp.id };
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
