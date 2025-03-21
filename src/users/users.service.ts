import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// import { CreateUserDto } from './dto/user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import axios from 'axios';
import { Agent } from '../agent/entities/agent.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly uRepository: Repository<User>,
    private readonly configService: ConfigService,
    @InjectRepository(Agent) private readonly aRepository: Repository<Agent>,
  ) {}
  async create(uName: string, manager: EntityManager) {
    try {
      const user = manager.getRepository(User).create({
        uName,
      });
      const saveduser = await manager.getRepository(User).save(user);
      return saveduser;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.uRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.uRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: any) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User does not exist!');
      }
      const updatedData = await this.uRepository.update(id, updateUserDto);
      return { message: 'Update Data Successfully' };
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByUName(uName: string): Promise<boolean> {
    const user = await this.uRepository.findOne({ where: { uName } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return !!user;
  }

  async verifyCodeToken(code: string, name: string, id: string, type: string) {
    try {
      console.log('data', type, code, id, name);
      if (name === 'x') {
        return await this.codeXToken(code, id, type);
      } else if (name === 'discord') {
        return await this.codeDiscordToken(code, id, type);
      } else {
        throw new Error('Unsupported social platform');
      }
    } catch (error) {
      console.error('Error in exchangeSocialCodeForToken:', error);
      throw new Error('Failed to exchange token');
    }
  }

  private async codeXToken(code: string, id: string, type: string) {
    try {
      const clientId = this.configService.get<string>('X_CLIENT_ID');
      const clientSecret = this.configService.get<string>('X_CLIENT_SECRET');
      const redirectUri = this.configService.get<string>('X_REDIRECT_URI');
      const credentials = btoa(`${clientId}:${clientSecret}`);
      const code_verifier = this.configService.get<string>('CODE_VERIFIER');

      const tokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          client_id: clientId,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: code_verifier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const { access_token } = tokenResponse.data;
      const userProfile = await axios.get(
        'https://api.twitter.com/2/users/me',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      const xData = {
        id: userProfile.data.data.id,
        username: userProfile.data.data.username,
      };

      let user: any;
      if (type === 'user') {
        user = await this.uRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        user.x = xData;
        await this.uRepository.save(user);
      } else {
        user = await this.aRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('Agent not found');
        }

        user.x = xData;
        await this.aRepository.save(user);
      }

      return { message: 'Agent X data updated successfully', user };
    } catch (error) {
      console.error('Error in codeXToken:', error);
      throw new Error('Failed to authenticate with Twitter');
    }
  }

  private async codeDiscordToken(code: string, id: string, type: string) {
    try {
      const clientId = this.configService.get<string>('DISCORD_CLIENT_ID');
      const clientSecret = this.configService.get<string>(
        'DISCORD_CLIENT_SECRET',
      );
      const redirectUri = this.configService.get<string>(
        'DISCORD_REDIRECT_URI',
      );

      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      });

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        params,
        { headers },
      );
      const { access_token } = tokenResponse.data;
      const userResponse = await axios.get(
        'https://discord.com/api/users/@me',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const discordData = {
        id: userResponse.data.id,
        username: userResponse.data.username,
      };

      let user = await this.uRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.discord = discordData;
      await this.uRepository.save(user);

      return { message: 'User Discord data updated successfully', user };
    } catch (error) {
      console.error('Error in codeDiscordToken:', error);
      throw new Error('Failed to authenticate with Discord');
    }
  }
}
