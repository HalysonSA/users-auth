import {
  Body,
  Controller,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import {
  NewUserPasswordRequestDTO,
  ResetUserPasswordRequestDTO,
} from '../../dtos/reset-password.dto';
import { ResetUserPasswordService } from './reset-password.service';

@Controller(routesV1.version)
export class ResetUserPasswordHttpController {
  constructor(
    private readonly resetUserPasswordService: ResetUserPasswordService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post(routesV1.user.resetPassword)
  async create(@Body() data: ResetUserPasswordRequestDTO) {
    return await this.resetUserPasswordService.execute(data.email);
  }

  @UsePipes(new ValidationPipe())
  @Patch(routesV1.user.resetPassword)
  async update(
    @Body() data: NewUserPasswordRequestDTO,
    @Query()
    query: {
      token: string;
    },
  ) {
    return await this.resetUserPasswordService.newPassword(
      data.newPassword,
      query.token,
    );
  }
}
