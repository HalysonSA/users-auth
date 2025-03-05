import {
  Controller,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Request } from 'express';
import { ListUsersService } from './list-users.service';

@Controller(routesV1.version)
export class ListUsersHttpController {
  constructor(private readonly listUserService: ListUsersService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Get(routesV1.user.root)
  async execute(@Req() req: Request) {
    return this.listUserService.execute(req.user);
  }
}
