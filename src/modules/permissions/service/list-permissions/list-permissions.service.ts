import { Inject, Injectable } from '@nestjs/common';
import { PermissionsRepositoryPort } from '../../repository/permissions.repository.port';
import { PERMISSIONS_REPOSITORY } from '../../permissions.token';

@Injectable()
export class ListPermissionService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
  ) {}

  async execute() {
    return await this.permissionsRepo.findAll();
  }
}
