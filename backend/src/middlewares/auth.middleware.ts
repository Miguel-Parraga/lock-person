import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  email: string;
  esAdministrador: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        estado: 'error',
        mensaje: 'No autorizado. Token requerido.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      estado: 'error',
      mensaje: 'Token inválido o expirado.'
    });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.esAdministrador) {
    return res.status(403).json({
      estado: 'error',
      mensaje: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};


