import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class SocialProfileDto {
  @IsString()
  @MinLength(3, { message: 'Id must be at least 3 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'ID can only contain letters and numbers',
  })
  id: string;

  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;
}
