import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentDto, UpdateAgentDto } from './dto/agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { Repository } from 'typeorm';
// import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private readonly aRepository: Repository<Agent>,
  ) {}

  async createAgent(createAgent: AgentDto) {
    try {
      const agent = this.aRepository.create(createAgent);
      return await this.aRepository.save(agent);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAll() {
    return await this.aRepository.find();
  }

  async updateAgentById(id: string, updateAgent: UpdateAgentDto) {
    try {
      return await this.aRepository.update(id, { ...updateAgent });
    } catch (error) {

    }
  }

  async findOne(id: string) {
    try {
      const agent = await this.aRepository.findOne({ where: { id } });
      console.log(agent);
      if (!agent) {
        throw new NotFoundException('Agent not found!');
      }
      return agent;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // update(id: number, updateAgentDto: UpdateAgentDto) {
  //   return `This action updates a #${id} agent`;
  // }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
