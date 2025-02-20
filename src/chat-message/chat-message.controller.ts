import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Session } from 'src/auth/entities/auth.entity';
import { Response } from 'express';

@Controller('chat-message')
// @UseGuards(AuthGuard)
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@CurrentUser() session: Session, @Body() createChatMessage: any) {
    return this.chatMessageService.create(session.uId, createChatMessage);
  }

  @Get('sse/:sessionId')
  streamChat(@Param('sessionId') sessionId: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.chatMessageService.subscribe(sessionId, res);
  }

  @Get(':cSessionId')
  @UseGuards(AuthGuard)
  findAll(@Param('cSessionId') cSessionId: string) {
    return this.chatMessageService.findAll(cSessionId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.chatMessageService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return this.chatMessageService.update(+id, updateChatMessageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.chatMessageService.deleteHistory(id);
  }
}
