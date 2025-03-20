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
  async twitterCallback(
    @Body('code') code: string,
    @Body('name') name: string,
    @Body('type') type: string,
    @Body('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.verifyCodeToken(
        code,
        name,
        type,
        id,
      );
      return data.user;
    } catch (error) {
      console.error('Error in social verification:', error);
      return error;
    }
  }
}
