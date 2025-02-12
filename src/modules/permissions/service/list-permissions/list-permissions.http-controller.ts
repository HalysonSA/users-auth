import { Controller, Get } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ListPermissionService } from './list-permissions.service';

@Controller(routesV1.version)
export class ListPermissionsHttpController {
  constructor(private readonly listPermissionService: ListPermissionService) {}

  @Get(routesV1.permission.root)
  async findAll() {
    return await this.listPermissionService.execute();
  }
}
