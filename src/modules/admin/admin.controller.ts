import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getStringQuery, getNumQuery } from '../../utils/queryHelper';
import { AuthRequest } from '../../utils/checkAuth';
import * as adminService from './admin.service';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsers({
    page: getNumQuery(req.query.page),
    limit: getNumQuery(req.query.limit),
    role: getStringQuery(req.query.role),
    search: getStringQuery(req.query.search),
    sortBy: getStringQuery(req.query.sortBy),
    sortOrder: getStringQuery(req.query.sortOrder),
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users retrieved successfully.',
    data: result.users,
    meta: result.meta,
  });
});

export const promoteToAdmin = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await adminService.promoteToAdmin(req.params.id as string, req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User promoted to admin successfully.',
    data: user,
  });
});

export const toggleUserStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await adminService.toggleUserStatus(req.params.id as string, req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
    data: user,
  });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const data = await adminService.getDashboardStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Dashboard data retrieved successfully.',
    data,
  });
});
