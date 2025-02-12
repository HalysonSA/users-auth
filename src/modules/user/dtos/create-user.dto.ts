import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class CreateUserRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @ValidateIf((o) => !o.owner_id)
  @IsString()
  @IsNotEmpty()
  password: string;
}
