import { Expose, Type } from 'class-transformer';
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
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { AgentType, BrowserType, ModelId } from 'src/helper/enums';
import { Token } from 'src/helper/types';

export class Social {
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;
}

export class ChatBind {
  botToken: string;
}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => ChatBind)
  telegram?: ChatBind;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChatBind)
  discord?: ChatBind;

  @IsOptional()
  @ValidateNested()
  @Type(() => Social)
  x?: Social;

  @IsString()
  @MaxLength(300)
  @MinLength(100)
  persona: string;

  // @ArrayNotEmpty()
  // @IsArray()
  // @IsString({ each: true })
  // instructions: string[];
  
  @IsEnum(BrowserType)
  search_engine_id: BrowserType;

  @IsEnum(ModelId)
  model_id: ModelId

  @IsString()
  @MaxLength(500)
  @MinLength(150)
  desc: string;

  @IsEnum(AgentType)
  typ: AgentType;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  vibility: string;
}

export class UpdateAgentDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  pic: string;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => Social)
  // telegram?: ChatBind;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => ChatBind)
  // discord?: ChatBind;

  @IsOptional()
  @ValidateNested()
  @Type(() => Social)
  x?: Social;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @MinLength(100)
  personality: string;

  @ArrayNotEmpty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instructions: string[];

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @MinLength(150)
  desc: string;
}

export class ResAgentDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() pic: string;
  @Expose() token: Token;
  @Expose() telegram?: ChatBind;
  @Expose() discord?: ChatBind;
  @Expose() x?: Social;
  @Expose() desc: string;
  @Expose() typ: AgentType;
  @Expose() vibility: string;
}
