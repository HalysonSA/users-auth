import { Module, Provider } from '@nestjs/common';
import { PERMISSIONS_REPOSITORY } from './permissions.token';
import { PermissionsRepository } from './repository/permissions.repository';
import { ListPermissionService } from './service/list-permissions/list-permissions.service';
import { CreateRelationshipUserPermissionService } from './service/create-relationship/create-relationship.service';
import { ListPermissionsHttpController } from './service/list-permissions/list-permissions.http-controller';
import { CreateRelationshipUserPermissionHttpController } from './service/create-relationship/create-relationship.http-controller';
import { USER_REPOSITORY } from '../user/user.token';
import { UserRepository } from '../user/repository/user.repository';
import { DeleteRelationshipUserPermissionHttpController } from './service/delete-relationship/delete-relationship.http-controller';
import { DeleteRelationshipUserPermissionService } from './service/delete-relationship/delete-relationship.service';

const repository: Provider[] = [
  {
    provide: PERMISSIONS_REPOSITORY,
    useClass: PermissionsRepository,
  },
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
];

const controllers = [
  ListPermissionsHttpController,
  CreateRelationshipUserPermissionHttpController,
  DeleteRelationshipUserPermissionHttpController,
];

const services: Provider[] = [
  ListPermissionService,
  CreateRelationshipUserPermissionService,
  DeleteRelationshipUserPermissionService,
];

@Module({
  controllers: [...controllers],
  providers: [...repository, ...services],
  exports: [...repository],
})
export class PermissionsModule {}
