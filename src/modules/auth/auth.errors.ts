export class InvalidCredentialsError extends Error {
  public readonly statusCode: number;

  constructor(message = 'invalid Email or password') {
    super(message);
    this.name = 'InvalidCredentialsError';
    this.statusCode = 401;
  }
}

export class TokenError extends Error {
  public readonly statusCode: number;

  constructor(message = 'Token Error') {
    super(message);
    this.name = 'TokenError';
    this.statusCode = 401;
  }
}
