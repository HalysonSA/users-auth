import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsUUID,
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

  @IsOptional()
  @IsUUID()
  owner_id?: string;
}
