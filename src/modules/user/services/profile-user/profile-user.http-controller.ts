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
import { ProfileUserService } from './profile-user.service';

@Controller(routesV1.version)
export class ProfileUserHttpController {
  constructor(private readonly profileUserService: ProfileUserService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Get(routesV1.user.me)
  async me(@Req() req: Request) {
    return this.profileUserService.execute(req.user.id);
  }
}
