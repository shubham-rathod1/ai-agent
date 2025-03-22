import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Session } from 'src/auth/entities/auth.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('checkusername/:uname')
  findByUName(@Param('uname') uName: string) {
    if (!uName) {
      throw new BadRequestException('Username is required');
    }
    return this.usersService.findByUName(uName);
  }

  @Post('verifytoken')
  @UseGuards(AuthGuard)
  async twitterCallback(@Body() body: any, @CurrentUser() session: Session) {
    const { uId } = session;
    const { code, name, type } = body;
    return await this.usersService.vToken(code, name, uId, type);
  }
}
