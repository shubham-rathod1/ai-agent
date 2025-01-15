import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  MaxLength,
  MinLength,
  Matches,
  ValidateNested,
  IsOptional,
  IsNotEmptyObject,
} from 'class-validator';
import { AgentType } from 'src/helper/enums';
import { Token } from 'src/helper/types';

export class AgentDto {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  pic: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Token)
  token: Token;

  @IsString()
  @MaxLength(500)
  @MinLength(150)
  bio: string;

  @IsEnum(AgentType)
  typ: AgentType;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  vibility: string;
}
