import { Permissions, UsersPermissions } from '@prisma/client';

export interface PermissionsRepositoryPort {
  findByRoleAndAction(role: string, action: string): Promise<Permissions>;
  createUserPermissionRelationship(
    userId: string,
    permissionId: string,
  ): Promise<UsersPermissions>;
}
