import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Session } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { extractAddr } from './auth.helper';
import { AuthDto } from './dto/user.dto';
import { UsersService } from 'src/users/users.service';
const { randomBytes } = require('crypto');
import { generateUsername } from 'unique-username-generator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly aRepository: Repository<Auth>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly uService: UsersService,
  ) {}
  async signUp(createUser: AuthDto, ip: string): Promise<Session> {
    const queryrunner = this.aRepository.manager.connection.createQueryRunner();
    await queryrunner.connect();
    await queryrunner.startTransaction();
    try {
      const { msg, sig, pubKey, typ } = createUser;
      const extAddr = await extractAddr(msg, sig, typ, pubKey);
      let addr = await this.getAddress(extAddr);
      if (!addr) {
        const uName = generateUsername('', 2, 15);
        const user = await this.uService.create(uName, queryrunner.manager);
        addr = this.aRepository.create({ address: extAddr, typ, uId: user.id });
        await this.aRepository.save(addr);
      }
      const session = this.saveSession(addr.uId, ip);
      await queryrunner.commitTransaction();
      return session;
    } catch (error) {
      await queryrunner.rollbackTransaction();
      throw error;
    } finally {
      await queryrunner.release();
    }
  }

  async getAddress(address: string): Promise<Auth> {
    return await this.aRepository.findOne({ where: { address } });
  }

  private async saveSession(uid: string, ip: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { uid, ip, sts: 1 },
    });
    if (session) {
      await this.logout(session.id);
    }
    const token = randomBytes(32).toString('hex');
    const login = await this.sessionRepository.save({
      uid,
      token,
      ip,
    });
    return login;
  }

  async logout(id: number): Promise<String> {
    const login = await this.sessionRepository.findOneBy({ id });
    if (login && login.sts != 0) {
      login.sts = 0;
      await this.sessionRepository.save(login);
      return 'Logged out successfully';
    }
    throw new NotFoundException('Not logged in or registered!');
  }
}
