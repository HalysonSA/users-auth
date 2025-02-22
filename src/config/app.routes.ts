const userRoot = 'user';
const permissionRoot = 'permission';
const authRoot = 'auth';

export const routesV1 = {
  version: 'v1',
  user: {
    root: userRoot,
    resetPassword: `${userRoot}/password/reset`,
  },
  auth: {
    root: authRoot,
    refresh: `${authRoot}/refresh`,
    validate: `${authRoot}/validate`,
  },
  permission: {
    root: permissionRoot,
  },
};
