export class InvalidCredentialsError extends Error {
  public readonly statusCode: number;

  constructor(message = 'E-mail ou senha inválidos.') {
    super(message);
    this.name = 'InvalidCredentialsError';
    this.statusCode = 401;
  }
}
