import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';
import { USER_REPOSITORY } from 'src/modules/user/user.token';
import { LoginRequestDTO } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { sign, decode, verify, TokenExpiredError } from 'jsonwebtoken';
import { InvalidCredentialsError, TokenError } from './auth.errors';
import { PERMISSIONS_REPOSITORY } from '../permissions/permissions.token';
import { PermissionsRepositoryPort } from '../permissions/repository/permissions.repository.port';
import { REFRESH_TOKEN_REPOSITORY } from './auth.token';
import { RefreshTokenRepositoryPort } from './repository/refreshToken.repository.port';

interface TokenData {
  id: string;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepo: PermissionsRepositoryPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
  ) {}

  private async generateAccessToken(token: string) {
    const decoded = decode(token) as TokenData;

    const accessToken = sign(
      {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
        permissions: decoded.permissions,
      },
      process.env.SECRET,
      {
        expiresIn: '15min',
      },
    );

    return { accessToken };
  }

  async refreshToken(token: string) {
    const decoded = decode(token) as TokenData;

    if (!decoded) {
      throw new Error('Invalid token format');
    }

    try {
      const tokenExists = await this.refreshTokenRepo.findToken(
        token,
        decoded.id,
      );

      if (!tokenExists) {
        throw new TokenError();
      }

      verify(token, process.env.SECRET);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        await this.refreshTokenRepo.delete(token);
        throw new TokenError('Expired token');
      }
      if (error instanceof TokenError) {
        throw new TokenError('Invalid token');
      }

      throw error;
    }

    return await this.generateAccessToken(token);
  }

  async execute(props: LoginRequestDTO) {
    const { email, password } = props;

    const user = await this.userRepo.findByEmail(email);
    const userPermissions = await this.permissionsRepo.findPermissionsByUserId(
      user.id,
    );

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const persistentToken = sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        permissions:
          userPermissions.map((perm) => `${perm.role}:${perm.action}`) || [],
      },
      process.env.SECRET,
      {
        expiresIn: '7d',
      },
    );

    await this.refreshTokenRepo.create(persistentToken, user.id);

    const generatedToken = await this.generateAccessToken(persistentToken);

    return {
      refreshToken: persistentToken,
      accessToken: generatedToken.accessToken,
    };
  }
}
