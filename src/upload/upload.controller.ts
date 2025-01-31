import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { KnowledgeBaseService } from './kb.service';
import { AuthGuard } from 'src/guards/auth.guards';
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

  @Post('kb/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.kbService.processFile(id, file);
  }

  @Get('kb/:id')
  async getKb(@Param('id') id: string) {
    return await this.kbService.findKbById(id);
  }
}
