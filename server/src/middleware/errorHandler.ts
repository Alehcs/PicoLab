import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiFailure } from '../types/api.js';

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const createResponseMeta = () => ({
  mode: 'mock' as const,
  source: 'mock' as const,
});

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', `No mock endpoint is registered for ${req.method} ${req.path}.`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const body: ApiFailure = {
    ok: false,
    error: {
      code: error instanceof AppError ? error.code : 'INTERNAL_ERROR',
      message:
        error instanceof Error
          ? error.message
          : 'The mock backend could not complete this request.',
      details: error instanceof AppError ? error.details : undefined,
    },
    meta: createResponseMeta(),
  };

  res.status(statusCode).json(body);
};
