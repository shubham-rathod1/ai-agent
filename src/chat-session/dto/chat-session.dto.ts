import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatSessionDto {
  @IsString()
  @IsNotEmpty()
  aId: string;
}
