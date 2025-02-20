import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ResetUserPasswordRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class NewUserPasswordRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  newPassword: string;
}
