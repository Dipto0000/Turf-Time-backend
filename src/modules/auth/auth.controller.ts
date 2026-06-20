import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { setAuthCookies, clearAuthCookies } from '../../utils/setCookie';
import { AuthRequest } from '../../utils/checkAuth';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  const result = await authService.registerUser({ name, email, password, phone });

  setAuthCookies(res, { token: result.token, refreshToken: result.refreshToken });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Registration successful.',
    data: { user: result.user, token: result.token },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  setAuthCookies(res, { token: result.token, refreshToken: result.refreshToken });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login successful.',
    data: { user: result.user, token: result.token },
  });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logged out successfully.',
  });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User retrieved successfully.',
    data: user,
  });
});

export const updateMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.updateProfile(req.user!.userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile updated successfully.',
    data: user,
  });
});
