import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TokenExpiredError } from 'jsonwebtoken';

//TODO: better error handler
@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    console.error(exception);

    if (this.isPrismaError(exception)) {
      const prismaError = exception as Prisma.PrismaClientKnownRequestError;

      // Handle the Prisma error
      switch (prismaError.code) {
        case 'P2002':
          // Unique constraint violation (e.g., duplicate entry)
          response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: 'Conflict: Unique constraint violation.',
          });
          break;

        case 'P2025':
          // NotFoundError
          response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Not Found: Resource not found.',
          });
          break;

        case 'P2003':
          // ForeignKeyViolationError
          response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            message: 'Conflict: Foreign key constraint violation.',
          });
          break;

        default:
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error.',
          });
      }
    } else {
      if (exception instanceof TokenExpiredError) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized.',
        });
      }

      if (exception instanceof ForbiddenException) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden.',
        });
      }

      if (exception instanceof BadRequestException) {
        const errors =
          exception instanceof BadRequestException
            ? exception.getResponse().toString
            : undefined;

        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          response: exception.getResponse(),
          message: errors,
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error.',
      });
    }
  }

  private isPrismaError(obj: any): obj is Prisma.PrismaClientKnownRequestError {
    return obj instanceof Prisma.PrismaClientKnownRequestError;
  }
}
