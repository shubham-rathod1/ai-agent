import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// @ValidatorConstraint({ name: 'isAtLeastOneField', async: false })
// export class IsAtLeastOneField implements ValidatorConstraintInterface {
//   validate(value: any, args: ValidationArguments) {
//     const object = args.object as any;
//     // Check if at least one of the specified fields is present
//     return object.tkr || object.tCAddress;
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'At least one of tkr or tCAddress must be provided.';
//   }
// }

export class Token {
  @Expose()
  @IsOptional()
  @IsString()
  //   @ValidateIf((o) => !o.tCAddress)
  tkr?: string;
  @Expose()
  @IsOptional()
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Invalid token address format. Must be a valid Ethereum address.',
  })
  //   @ValidateIf((o) => !o.tkr)
  tCAddress?: string;
  //   @Validate(IsAtLeastOneField, {
  //     message: 'At least one of tkr or tCAddress must be provided.',
  //   })
  //   validateAtLeastOne: boolean;
}

export class KbQuery {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // Ensures all elements are integers
  @Type(() => Number) // Converts from string to number
  ids: number[];
}

export class SocialProfileDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;
}

export class ProfilePhotoDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  pro?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  cvr?: string;
}
