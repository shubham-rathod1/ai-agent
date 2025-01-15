import { IsArray } from 'class-validator';

export class SingleUploadDto {
  @IsArray()
  file: any;
}

export class MultiUploadDto {
  @IsArray()
  files: any[];
}
