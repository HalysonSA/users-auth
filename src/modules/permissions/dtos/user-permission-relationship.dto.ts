import { IsUUID, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRelationshipUserPermissionRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  permissions: string[];
}
