/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AppErrorOptions {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly context?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    {
      code = "INTERNAL_ERROR",
      context,
      isOperational = true,
    }: AppErrorOptions = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/*
//* this is for express server
export interface ApiErrorOptions {
  code?: string;
  path?: string;
  param?: string;
  meta?: Record<string, any>;
  isOperational?: boolean;
}

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public path?: string;
  public param?: string;
  public meta?: Record<string, any>;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    options: ApiErrorOptions = {},
    stack?: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = options.code ?? "INTERNAL_ERROR";
    this.path = options.path;
    this.param = options.param;
    this.meta = options.meta;
    this.isOperational = options.isOperational ?? true;

    if (stack && stack.trim()) this.stack = stack;
    else if (typeof Error.captureStackTrace === "function")
      Error.captureStackTrace(this, this.constructor);
  }
}
*/
