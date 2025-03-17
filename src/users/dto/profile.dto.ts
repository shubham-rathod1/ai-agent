import { IsString, Matches, IsUrl, IsOptional } from 'class-validator';

export class ProfilePhotoDto {
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Profile image must be a valid URL' })
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: 'Profile image URL must end with .jpg, .jpeg, .png',
  })
  pro?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Cover image must be a valid URL' })
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: 'Cover image URL must end with .jpg, .jpeg, .png',
  })
  cvr?: string;
}
