import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Session } from 'src/auth/entities/auth.entity';

@Controller('chat-message')
@UseGuards(AuthGuard)
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post()
  create(@CurrentUser() session: Session, @Body() createChatMessage: any) {
    return this.chatMessageService.create(session.uId, createChatMessage);
  }

  @Get(':cSessionId')
  findAll(@Param('cSessionId') cSessionId: string) {
    return this.chatMessageService.findAll(cSessionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatMessageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return this.chatMessageService.update(+id, updateChatMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatMessageService.deleteHistory(id);
  }
}
