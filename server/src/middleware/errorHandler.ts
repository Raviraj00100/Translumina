import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  console.error(`[Error] ${req.method} ${req.path}:`, message);

  const statusCode = (err as { status?: number; statusCode?: number }).statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
}
