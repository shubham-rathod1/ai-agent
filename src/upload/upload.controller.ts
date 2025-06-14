import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { KnowledgeBaseService } from './kb.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { KbQuery } from 'src/helper/types';
// import { KnowledgeBaseService } from 'src/agent/kb.service';
// import { MultiUploadDto, SingleUploadDto } from './dto/uplaod.dto';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly kbService: KnowledgeBaseService,
  ) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    const fileUrl = await this.uploadService.upload(file);
    return { url: fileUrl };
  }

  @Post('multi')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMulti(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new HttpException('Files are required', HttpStatus.BAD_REQUEST);
    }
    const fileUrls = await this.uploadService.multiUpload(files);
    return fileUrls;
  }

  @Post('kb/file/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.kbService.uploadPdf(id, file);
  }

  @Post('kb/url/:id')
  async txt(
    @Param('id') id: string,
    @Body() Body: { url: string },
  ) {
    return await this.kbService.uploadUrl(id, Body.url);
  }

  @Delete('kb')
  async deleteKb(@Query() query: { dId: string }) {
    const { dId } = query;
    console.log('from controller', dId);
    return await this.kbService.deleteKb(dId);
  }

  @Get('kb/:id')
  async getKb(@Param('id') id: string) {
    return await this.kbService.findKbByKid(id);
  }
}
