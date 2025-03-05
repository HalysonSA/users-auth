import { Permissions, UsersPermissions } from '@prisma/client';

export interface PermissionsRepositoryPort {
  findByRoleAndAction(role: string, action: string): Promise<Permissions>;
  findPermissionsByUserId(userId: string): Promise<Permissions[]>;
  findAll(): Promise<Permissions[]>;
  createUserPermissionRelationships(
    userId: string,
    permissions: string[],
  ): Promise<void>;
  deleteUserPermissionRelationship(
    user_id: string,
    permissions: string[],
  ): Promise<void>;
}
