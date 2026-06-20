import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const sendResponse = <T>(res: Response, options: ApiResponse<T>) => {
  const { statusCode, ...rest } = options;
  return res.status(statusCode).json(rest);
};
