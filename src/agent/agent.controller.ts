import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentDto, ResAgentDto, UpdateAgentDto } from './dto/agent.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Session } from 'src/auth/entities/auth.entity';
import { plainToInstance } from 'class-transformer';
import { ApiKeyAuthGuard } from 'src/guards/apikey.guard';
// import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@CurrentUser() session: Session, @Body() createAgent: AgentDto) {
    console.log(createAgent);
    return this.agentService.createAgent(session.uid, createAgent);
  }
  @Post('chat')
  @UseGuards(ApiKeyAuthGuard) // Protect endpoint with API key auth
  async chatWithAgent(@Req() req, @Body() body) {
    return this.agentService.processChat(req.user, body.message);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateById(
    @CurrentUser() session: Session,
    @Param('id') id: string,
    @Body() updateAgent: UpdateAgentDto,
  ) {
    return this.agentService.updateAgentById(session.uid, id, updateAgent);
  }

  @Get()
  async findAll() {
    const agents = await this.agentService.findAll();
    return plainToInstance(ResAgentDto, agents, {
      excludeExtraneousValues: true,
    });
  }

  @Get('tokenData')
  async getTokenData(@Query() query: { network: string; tAddress: string }) {
    const { network, tAddress } = query;
    return this.agentService.tokenData(network, tAddress);
  }

  @Get('byUid')
  @UseGuards(AuthGuard)
  findByUid(@CurrentUser() session: Session) {
    console.log('session', session);
    return this.agentService.findByUserId(session.uid);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const agent = await this.agentService.findOne(id);
    return plainToInstance(ResAgentDto, agent, {
      excludeExtraneousValues: true,
    });
  }

  @Get('private/:id')
  @UseGuards(AuthGuard)
  findDetailedOne(@Param('id') id: string) {
    return this.agentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentService.remove(+id);
  }
}
