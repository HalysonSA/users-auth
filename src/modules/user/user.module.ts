import { Module, Provider } from '@nestjs/common';
import { USER_REPOSITORY } from './user.token';
import { UserRepository } from './repository/user.repository';
import { CreateUserService } from './services/create-user/create-user.service';
import { CreateUserHttpController } from './services/create-user/create-user.http-controller';
import { PermissionsModule } from '../permissions/permissions.module';
import { ResetUserPasswordService } from './services/reset-password/reset-password.service';
import { ResetUserPasswordHttpController } from './services/reset-password/reset-password.http-controller';

const repository: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];
const services: Provider[] = [CreateUserService, ResetUserPasswordService];

const controllers = [CreateUserHttpController, ResetUserPasswordHttpController];

@Module({
  imports: [PermissionsModule],
  controllers: [...controllers],
  providers: [...repository, ...services],
  exports: [...repository],
})
export class UserModule {}
