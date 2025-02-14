import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { CreateChatSessionDto } from './dto/chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Session } from 'src/auth/entities/auth.entity';

@Controller('chat-session')
@UseGuards(AuthGuard)
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Post()
  create(
    @CurrentUser() session: Session,
    @Body() createChatSession: CreateChatSessionDto,
  ) {
    return this.chatSessionService.create(session.uId, createChatSession);
  }

  @Get()
  findAll(@CurrentUser() session: Session, @Query('aId') aId: string) {
    return this.chatSessionService.findAll(session.uId, aId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatSessionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatSessionDto: UpdateChatSessionDto,
  ) {
    return this.chatSessionService.update(+id, updateChatSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatSessionService.remove(+id);
  }
}
