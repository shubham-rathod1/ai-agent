import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../auth/entities/auth.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Session)
    private readonly loginRepository: Repository<Session>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const webSocket = context.getType() === 'ws';
    const request = webSocket
      ? await context.switchToWs().getClient()
      : await context.switchToHttp().getRequest();
    // const token = webSocket ? this.extractToken(await)
    // const request = await context.switchToHttp().getRequest();

    // you can access body in this request
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    const login = await this.validateToken(token);

    if (!login) {
      throw new UnauthorizedException('Invalid token');
    }
    request.session = login;
    return true;
  }
  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }
  private async validateToken(token: string): Promise<Session | null> {
    const login = await this.loginRepository.findOne({
      where: { token, sts: 1 },
    });
    return login || null;
  }
}
