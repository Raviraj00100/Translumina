import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface AuthenticatedRequest extends Request {
  requestId?: string;
  startTime?: number;
}

export function requestLogger(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.requestId = reqId;
  req.startTime = Date.now();

  res.setHeader('X-Request-Id', reqId);

  res.on('finish', () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    // Structured production-safe logging (no private user payload)
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: reqId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip
    };

    console.log(JSON.stringify(logEntry));
  });

  next();
}
