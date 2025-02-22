import { Module, Provider } from '@nestjs/common';
import { USER_REPOSITORY } from './user.token';
import { UserRepository } from './repository/user.repository';
import { CreateUserService } from './services/create-user/create-user.service';
import { CreateUserHttpController } from './services/create-user/create-user.http-controller';
import { PermissionsModule } from '../permissions/permissions.module';
import { ResetUserPasswordService } from './services/reset-password/reset-password.service';
import { ResetUserPasswordHttpController } from './services/reset-password/reset-password.http-controller';
import { ProfileUserService } from './services/profile-user/profile-user.service';
import { ProfileUserHttpController } from './services/profile-user/profile-user.http-controller';

const controllers = [
  CreateUserHttpController,
  ResetUserPasswordHttpController,
  ProfileUserHttpController,
];

const services: Provider[] = [
  CreateUserService,
  ResetUserPasswordService,
  ProfileUserService,
];

const repository: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];

@Module({
  imports: [PermissionsModule],
  controllers: [...controllers],
  providers: [...repository, ...services],
  exports: [...repository],
})
export class UserModule {}
