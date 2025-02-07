import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
// import { CreateUserDto } from './dto/user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly uRepository: Repository<User>,
  ) {}
  async create(body: { uName: string }) {
    const queryRunner = this.uRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = this.uRepository.create({
        ...body,
      });
      const saveduser = await this.uRepository.save(user);
      await queryRunner.commitTransaction();
      return saveduser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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
      return await this.uRepository.update(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
