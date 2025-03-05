import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class instanceDto {
  @IsString()
  name: string;

  @IsString()
  adminAddress: string;

  @Type(() => String)
  moderators: string[];

  @IsString()
  streamUrl: string;

  @IsString()
  aId: string;

  @IsString()
  tokenAddress: string;

  minTokenValue: number;
}
