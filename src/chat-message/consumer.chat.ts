import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { ChatMessage, ChatRole } from './entities/chat-message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Processor('1v1Chat')
export class ChatProcessor extends WorkerHost {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
  ) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case 'pChat': {
        console.log('it ran from consumer');
        const { cSessionId, pId, history } = job.data;
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
                knowledge_base_id: '1',
                messages: history,
              }),
            },
          );
          const res = await response.json();
          const cntnt = history[history.length - 1];
          const msg = this.chatRepo.create({
            cSessionId,
            pId,
            role: ChatRole.USER,
            message: cntnt.content,
          });
          console.log(res);
          await this.chatRepo.save(msg);
          const resp = this.chatRepo.create({
            cSessionId,
            pId: msg.id,
            role: ChatRole.ASSISTANT,
            message: res.response,
          });
          await this.chatRepo.save(resp);
          return { ...res, chatId: resp.id };
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
