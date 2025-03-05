import {
  Body,
  Controller,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { DeleteRelationshipUserPermissionService } from './delete-relationship.service';
import { RelationshipUserPermissionRequestDTO } from '../../dtos/user-permission-relationship.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Request } from 'express';
@Controller(routesV1.version)
export class DeleteRelationshipUserPermissionHttpController {
  constructor(
    private readonly deleteRelationshipService: DeleteRelationshipUserPermissionService,
  ) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete(routesV1.permission.root)
  async create(
    @Body() data: RelationshipUserPermissionRequestDTO,
    @Req() req: Request,
  ) {
    return await this.deleteRelationshipService.execute(data, req.user);
  }
}
