import {
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateIf,
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
  @IsOptional()
  @IsString()
//   @ValidateIf((o) => !o.tCAddress)
  tkr?: string;
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
