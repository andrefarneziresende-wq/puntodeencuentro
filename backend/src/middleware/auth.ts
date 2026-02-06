/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado.' });
    return;
  }

  const token = authHeader.substring(7);
  const result = authService.verifyToken(token);

  if (!result.valid || !result.userId) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }

  req.userId = result.userId;
  next();
}

/**
 * Optional authentication - doesn't fail if no token
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const result = authService.verifyToken(token);

    if (result.valid && result.userId) {
      req.userId = result.userId;
    }
  }

  next();
}
