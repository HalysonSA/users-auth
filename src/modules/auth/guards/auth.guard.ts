import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  permissions: string[];
}

declare module 'express' {
  export interface Request {
    user?: User;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      const user = verify(token, process.env.SECRET) as User;
      if (!user) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Erro ao processar token');
    }
  }
}
