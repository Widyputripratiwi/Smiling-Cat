import { Response } from 'express';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
    res.status(statusCode).json({
        success: true,
        data,
    });
}

export function sendCreated<T>(res: Response, data: T): void {
    sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): void {
    res.status(204).end();
}

export function sendError(res: Response, message: string, statusCode = 400): void {
    res.status(statusCode).json({
        success: false,
        error: message,
    });
}

export function sendPaginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number
): void {
    res.status(200).json({
        success: true,
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
