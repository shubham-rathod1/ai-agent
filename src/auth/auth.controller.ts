import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthDto } from './dto/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Session } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('connect')
  signUp(@Body() createUser: AuthDto, @Req() request: Request) {
    const clientIp = this.getClientIp(request);
    return this.authService.signUp(createUser, clientIp);
  }

  @Get('currentUser')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() session: Session): Session {
    return session;
  }

  @Patch('disconnect')
  @UseGuards(AuthGuard)
  logout(@CurrentUser() session: Session) {
    return this.authService.logout(session.id);
  }

  private getClientIp(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor)
        ? forwardedFor
        : forwardedFor.split(',');
      return ips[0].trim();
    }
    let ip = request.ip || request.socket.remoteAddress || '';

    // Handle IPv6 localhost address
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }
    // Remove IPv6 prefix if present
    if (ip.startsWith('::ffff:')) {
      ip = ip.slice(7);
    }
    return ip;
  }
}
