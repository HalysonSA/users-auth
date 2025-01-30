import { Module, Provider } from '@nestjs/common';
import { AuthHttpController } from './auth.http-controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthHttpController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
