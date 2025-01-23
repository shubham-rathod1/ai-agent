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
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentDto, UpdateAgentDto } from './dto/agent.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
  ) {}

  @Post()
  create(@Body() createAgent: AgentDto) {
    console.log(createAgent);
    return this.agentService.createAgent(createAgent);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateAgent: UpdateAgentDto) {
    console.log(updateAgent);
    return this.agentService.updateAgentById(id, updateAgent);
  }

  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentService.remove(+id);
  }
}
