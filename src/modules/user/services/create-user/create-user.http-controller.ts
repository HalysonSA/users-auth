import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { CreateUserService } from './create-user.service';
import { CreateUserRequestDTO } from '../../dtos/create-user.dto';

@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(private readonly createUserService: CreateUserService) {}

  @UsePipes(new ValidationPipe())
  @Post(routesV1.user.root)
  async create(@Body() data: CreateUserRequestDTO) {
    return await this.createUserService.execute(data);
  }
}
