import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { GrpMessageService } from './grp-message.service';
import { instanceDto } from './dto/grp-message.dto';
// import { UpdateGrpMessageDto } from './dto/update-grp-message.dto';
import { Response } from 'express';

@Controller('grp-message')
export class GrpMessageController {
  constructor(private readonly grpMessageService: GrpMessageService) {}

  @Post('message')
  async sendMessage(
    @Body()
    createGrpMessage: {
      instanceId: number;
      senderAddress: string;
      content: string;
    },
  ) {
    const { instanceId, senderAddress, content } = createGrpMessage;
    // Save message in DB
    const message = await this.grpMessageService.create(
      senderAddress,
      instanceId,
      content,
      null,
      null,
    );

    // Return response
    return { success: true, messageId: message.id, content: message.content };
  }

  @Post('grp-instance')
  async createInstance(@Body() instance: any) {
    return this.grpMessageService.createInstance(instance);
  }

  @Get('grp-instance')
  async getInstanceByAid(@Query('aId') aId: string) {
    console.log("aid", aId)
    return await this.grpMessageService.findOneInstance(aId);
  }

  @Get('sse/:instanceId')
  streamChat(@Param('instanceId') instanceId: number, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.grpMessageService.subscribe(instanceId, res);
  }

  @Get()
  findAll() {
    return this.grpMessageService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.grpMessageService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGrpMessageDto: UpdateGrpMessageDto,
  // ) {
  //   return this.grpMessageService.update(+id, updateGrpMessageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grpMessageService.remove(+id);
  }
}
