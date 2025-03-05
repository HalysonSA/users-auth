import { IsUUID, IsArray, IsNotEmpty } from 'class-validator';

export class RelationshipUserPermissionRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  permissions: string[];
}
