import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { CreateRelationshipUserPermissionService } from './create-relationship.service';
import { CreateRelationshipUserPermissionRequestDTO } from '../../dtos/user-permission-relationship.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Request } from 'express';
@Controller(routesV1.version)
export class CreateRelationshipUserPermissionHttpController {
  constructor(
    private readonly createRelationshipService: CreateRelationshipUserPermissionService,
  ) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Post(routesV1.permission.root)
  async create(
    @Body() data: CreateRelationshipUserPermissionRequestDTO,
    @Req() req: Request,
  ) {
    return await this.createRelationshipService.execute(data, req.user);
  }
}
