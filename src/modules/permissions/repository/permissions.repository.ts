import { Injectable } from '@nestjs/common';
import { PermissionsRepositoryPort } from './permissions.repository.port';
import {
  PermissionActionEnum,
  PermissionRolesEnum,
  Permissions,
  UsersPermissions,
} from '@prisma/client';
import { PrismaService } from 'src/libs/database/prisma.service';

@Injectable()
export class PermissionsRepository implements PermissionsRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByRoleAndAction(
    role: PermissionRolesEnum,
    action: PermissionActionEnum,
  ): Promise<Permissions> {
    return await this.prisma.permissions.findFirst({
      where: {
        role,
        action,
      },
    });
  }
  async createUserPermissionRelationship(
    userId: string,
    permissionId: string,
  ): Promise<UsersPermissions> {
    return await this.prisma.usersPermissions.create({
      data: {
        user_id: userId,
        permission_id: permissionId,
      },
    });
  }
}
