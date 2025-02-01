import { Module, Provider } from '@nestjs/common';
import { AuthHttpController } from './auth.http-controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { REFRESH_TOKEN_REPOSITORY } from './auth.token';
import { RefreshTokenRepository } from './repository/refreshToken.repository';

const repositories: Provider[] = [
  {
    provide: REFRESH_TOKEN_REPOSITORY,
    useClass: RefreshTokenRepository,
  },
];

@Module({
  imports: [UserModule, PermissionsModule],
  controllers: [AuthHttpController],
  providers: [AuthService, ...repositories],
  exports: [],
})
export class AuthModule {}
