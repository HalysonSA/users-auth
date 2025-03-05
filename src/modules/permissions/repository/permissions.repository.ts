import { Injectable } from '@nestjs/common';
import { PermissionsRepositoryPort } from './permissions.repository.port';
import {
  PermissionActionEnum,
  PermissionRolesEnum,
  Permissions,
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

  async findPermissionsByUserId(userId: string): Promise<Permissions[]> {
    const userPermissions = await this.prisma.usersPermissions.findMany({
      select: {
        permission: {
          select: {
            id: true,
            role: true,
            action: true,
          },
        },
      },
      where: {
        user_id: userId,
      },
    });

    return userPermissions.map((item) => item.permission);
  }

  async createUserPermissionRelationships(
    userId: string,
    permissions: string[],
  ) {
    await this.prisma.usersPermissions.createMany({
      data: permissions.map((permission) => ({
        user_id: userId,
        permission_id: permission,
      })),
      skipDuplicates: true,
    });
  }

  async deleteUserPermissionRelationship(
    user_id: string,
    permissions: string[],
  ) {
    await this.prisma.usersPermissions.deleteMany({
      where: {
        user_id,
        permission_id: { in: permissions },
      },
    });
  }

  async findAll(): Promise<Permissions[]> {
    return await this.prisma.permissions.findMany();
  }
}
