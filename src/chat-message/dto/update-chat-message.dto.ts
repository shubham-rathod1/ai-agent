import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from './chat-message.dto';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {}
