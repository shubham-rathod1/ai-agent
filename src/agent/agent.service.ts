import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AgentDto, UpdateAgentDto } from './dto/agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
// import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private readonly aRepository: Repository<Agent>,
  ) {}

  async createAgent(uId: string, createAgent: AgentDto) {
    try {
      const agent = this.aRepository.create({ uId, ...createAgent });
      return await this.aRepository.save(agent);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAll() {
    return await this.aRepository.find();
  }

  async tokenData(network: string, tAddress: string) {
    try {
      const data = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${tAddress}?include=top_pools`,
      );
      return await data.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateAgentById(uId: string, id: string, updateAgent: UpdateAgentDto) {
    try {
      const agent = await this.aRepository.findOneBy({ uId });
      if (!agent || agent.id != id) {
        return new UnauthorizedException('Not allowed to update this agent!');
      }
      await this.aRepository.update(id, { ...updateAgent });
      return `Agent - ${id} updated`;
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      const agent = await this.aRepository.findOne({ where: { id } });
      if (!agent) {
        throw new NotFoundException('Agent not found!');
      }
      return agent;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findByUserId(uId: string): Promise<Agent[]> {
    try {
      const agents = await this.aRepository.find({ where: { uId } });
      return agents;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async processChat(uId: string, message: string) {
    return { user: uId, message };
  }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
