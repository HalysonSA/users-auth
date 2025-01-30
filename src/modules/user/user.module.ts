import { Module, Provider } from '@nestjs/common';
import { USER_REPOSITORY } from './user.token';
import { UserRepository } from './repository/user.repository';
import { CreateUserService } from './services/create-user/create-user.service';
import { CreateUserHttpController } from './services/create-user/create-user.http-controller';
import { PermissionsModule } from '../permissions/permissions.module';

const repository: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];
const services: Provider[] = [CreateUserService];

const controllers = [CreateUserHttpController];

@Module({
  imports: [PermissionsModule],
  controllers: [...controllers],
  providers: [...repository, ...services],
})
export class UserModule {}
