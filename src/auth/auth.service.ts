import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Session } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { extractAddr } from './auth.helper';
import { AuthDto } from './dto/user.dto';
const { randomBytes } = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly aRepository: Repository<Auth>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async signUp(createUser: AuthDto, ip: string): Promise<Session> {
    const { msg, sig, pubKey, typ } = createUser;
    const extAddr = await extractAddr(msg, sig, typ, pubKey);
    let addr = await this.getAddress(extAddr);
    console.log('addr', addr);
    if (!addr) {
      addr = await this.aRepository.save({ address: extAddr, typ });
    }
    return this.saveSession(addr.id, ip);
  }

  async getAddress(address: string): Promise<Auth> {
    return await this.aRepository.findOne({ where: { address } });
  }

  private async saveSession(aid: number, ip: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { aid: aid, ip, sts: 1 },
    });
    if (session) {
      await this.logout(session.id);
    }
    const token = randomBytes(32).toString('hex');
    const login = await this.sessionRepository.save({
      aid,
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
