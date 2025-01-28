import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SignatureType } from 'src/helper/enums';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  @IsNotEmpty()
  sig: string;

  @IsString()
  @IsNotEmpty()
  typ: SignatureType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pubKey?: string;
}
