import { Response } from 'express';
import { env } from '../config/env';

interface CookieOptions {
  token: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, options: CookieOptions) => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
  };

  res.cookie('token', options.token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  if (options.refreshToken) {
    res.cookie('refreshToken', options.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
};
