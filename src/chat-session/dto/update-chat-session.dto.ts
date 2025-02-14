import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSessionDto } from './chat-session.dto';

export class UpdateChatSessionDto extends PartialType(CreateChatSessionDto) {}
