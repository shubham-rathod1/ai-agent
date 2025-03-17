import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsObject,
  IsUrl,
  MinLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { SignatureType } from 'src/helper/enums';
import { SocialProfileDto } from './social.dto';
import { ProfilePhotoDto } from './profile.dto';

// export class CreateUserDto {
//   @IsUUID()
//   id: string;

//   @IsString()
//   @MaxLength(15)
//   @MinLength(3)
//   @Transform(({ value }) => value.toLowerCase())
//   @Matches(/^[a-zA-Z0-9_]+$/, {
//     message: 'Username can only contain letters, numbers, and underscores.',
//   })
//   uName: string;

//   @IsOptional()
//   @IsString()
//   email?: string;

//   @IsOptional()
//   @IsObject()
//   @IsUrl()
//   img?: {
//     pro?: string;
//     cvr?: string;
//   };

//   @IsOptional()
//   @IsObject()
//   telegram?: {
//     id: string;
//     username: string;
//   };

//   @IsOptional()
//   @IsObject()
//   discord?: {
//     id: string;
//     username: string;
//   };

//   @IsOptional()
//   @IsObject()
//   x?: {
//     id: string;
//     username: string;
//   };

//   cta: Date;
//   uta: Date;
// }
export class UpdateUserDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(3)
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  uName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfilePhotoDto)
  img?: ProfilePhotoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialProfileDto)
  telegram?: SocialProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialProfileDto)
  discord?: SocialProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialProfileDto)
  x?: SocialProfileDto;

  @IsOptional()
  cta?: Date;

  @IsOptional()
  uta?: Date;
}
