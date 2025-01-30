import { Module, Provider } from '@nestjs/common';
import { PERMISSIONS_REPOSITORY } from './permissions.token';
import { PermissionsRepository } from './repository/permissions.repository';

const repository: Provider[] = [
  {
    provide: PERMISSIONS_REPOSITORY,
    useClass: PermissionsRepository,
  },
];

@Module({
  controllers: [],
  providers: [...repository],
  exports: [...repository],
})
export class PermissionsModule {}
