import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { AuthService } from './auth.service';
import { LoginRequestDTO } from './dtos/login.dto';

@Controller(routesV1.version)
export class AuthHttpController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post(routesV1.auth.root)
  async login(@Body() data: LoginRequestDTO) {
    return await this.authService.execute(data);
  }

  @Get(routesV1.auth.refresh)
  async refreshToken(@Headers('authorization') token: string) {
    console.log(token);

    return { token };
    // return await this.authService.execute();
  }
}
