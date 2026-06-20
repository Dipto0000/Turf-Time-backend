import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { verifyToken } from './jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw createError(401, 'Authentication required. Please log in.');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('+password');

    if (!user) {
      throw createError(401, 'User no longer exists.');
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof createError.HttpError) {
      next(error);
    } else {
      next(createError(401, 'Invalid or expired token.'));
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(createError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
};
