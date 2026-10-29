export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error {
  statusCode: number;
  details?: Object[];

  constructor(message: string, details?: Object[]) {
    super(message);
    this.details = details ?? [];
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  details?: Object[];

  constructor(message?: string, details?: Object[]) {
    super(message || "Internal Server Error");
    this.details = details ?? [];
    this.statusCode = 500;
    this.name = "InternalServerError";
  }
}
