import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
    details?: unknown;
}

export function errorMiddleware(
    err: ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details,
        }),
    });
}

export function notFoundMiddleware(_req: Request, res: Response): void {
    res.status(404).json({ error: 'Not Found' });
}

export function createError(
    statusCode: number,
    message: string,
    details?: unknown
): ApiError {
    const error: ApiError = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
}
