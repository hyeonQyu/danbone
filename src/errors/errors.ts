export const ERROR_NAME = {
  duplicate: 'DuplicateError',
  notFound: 'NotFoundError',
  invalidValue: 'InvalidValueError',
  expiredToken: 'ExpiredTokenError',
  auth: 'AuthError',
};

export class DuplicateError extends Error {
  readonly name = ERROR_NAME.duplicate;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  readonly name = ERROR_NAME.notFound;

  constructor(message: string) {
    super(message);
  }
}

export class InvalidValueError extends Error {
  readonly name = ERROR_NAME.invalidValue;

  constructor(message: string) {
    super(message);
  }
}

export class ExpiredTokenError extends Error {
  readonly name = ERROR_NAME.expiredToken;

  constructor(message: string) {
    super(message);
  }
}

export class AuthError extends Error {
  readonly name = ERROR_NAME.auth;

  constructor(message: string) {
    super(message);
  }
}
