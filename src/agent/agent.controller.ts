import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentDto } from './dto/agent.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  create(@Body() createAgent: AgentDto) {
    console.log(createAgent);
    return this.agentService.createAgent(createAgent);
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
