import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
// import { CreateUserDto } from './dto/user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly uRepository: Repository<User>,
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
  // check username Exist or Not
  async findByUName(uName: string): Promise<boolean> {
    const user = await this.uRepository.findOne({ where: { uName } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return !!user;
  }
}
