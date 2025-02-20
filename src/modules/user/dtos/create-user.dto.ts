import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @IsString()
  @IsOptional()
  password: string;
}
