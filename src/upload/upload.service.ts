import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { S3 } from 'aws-sdk';
  import { ConfigService } from '@nestjs/config';
  import { randomUUID } from 'crypto';
  
  @Injectable()
  export class UploadService {
    constructor(private readonly configService: ConfigService) {}
    private AWS_S3_BUCKET_NAME =
      this.configService.get<string>('AWS_S3_BUCKET_NAME');
    private s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
    private readonly allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
    ];
  
    async upload(file: Express.Multer.File): Promise<string> {
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type');
      }
      const fileKey = `${randomUUID()}-${file.originalname}`;
      try {
        const uploadResult = await this.s3
          .upload({
            Bucket: this.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
          .promise();
        return uploadResult.Location;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error uploading file!');
      }
    }
  
    async multiUpload(files: Express.Multer.File[]): Promise<string[]> {
      let urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await this.upload(files[i]);
        urls.push(url);
      }
      return urls;
    }
  }
  