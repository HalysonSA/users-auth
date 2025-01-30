import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from 'src/modules/user/repository/user.repository.port';
import { USER_REPOSITORY } from 'src/modules/user/user.token';
import { LoginRequestDTO } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { sign, decode } from 'jsonwebtoken';
import { InvalidCredentialsError } from './auth.errors';

interface TokenData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async generateAccessToken(token: string) {
    const decoded = decode(token) as TokenData;

    const accessToken = sign(
      {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
      },
      process.env.SECRET,
      {
        expiresIn: '15min',
      },
    );

    return { accessToken };
  }

  async execute(props: LoginRequestDTO) {
    const { email, password } = props;

    const user = await this.userRepo.findByEmail(email);

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
      },
      process.env.SECRET,
      {
        expiresIn: '7d',
      },
    );

    const generatedToken = await this.generateAccessToken(persistentToken);

    return {
      refreshToken: persistentToken,
      accessToken: generatedToken.accessToken,
    };
  }
}
