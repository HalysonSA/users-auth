import {
  Controller,
  UsePipes,
  ValidationPipe,
  Delete,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { DeleteUserService } from './delete-user.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Request } from 'express';

@Controller(routesV1.version)
export class DeleteUserHttpController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete(routesV1.user.delete)
  async execute(@Param() param: { id: string }, @Req() req: Request) {
    return await this.deleteUserService.execute(param.id, req.user);
  }
}
