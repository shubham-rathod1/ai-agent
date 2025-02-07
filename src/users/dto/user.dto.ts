import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SignatureType } from 'src/helper/enums';

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   msg: string;

//   @IsString()
//   @IsNotEmpty()
//   sig: string;

//   @IsString()
//   @IsNotEmpty()
//   typ: SignatureType;

//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(15)
//   @Transform(({ value }) => value.toLowerCase())
//   username: string;

//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   pubKey?: string;
// }
