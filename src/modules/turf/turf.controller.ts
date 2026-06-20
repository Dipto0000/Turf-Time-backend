import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getStringQuery, getNumQuery } from '../../utils/queryHelper';
import * as turfService from './turf.service';

export const createTurf = catchAsync(async (req: Request, res: Response) => {
  const turf = await turfService.createTurf(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Turf created successfully.',
    data: turf,
  });
});

export const getAllTurfs = catchAsync(async (req: Request, res: Response) => {
  const result = await turfService.getAllTurfs({
    page: getNumQuery(req.query.page),
    limit: getNumQuery(req.query.limit),
    search: getStringQuery(req.query.search),
    sortBy: getStringQuery(req.query.sortBy),
    sortOrder: getStringQuery(req.query.sortOrder),
    featured: getStringQuery(req.query.featured),
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Turfs retrieved successfully.',
    data: result.turfs,
    meta: result.meta,
  });
});

export const getTurfBySlug = catchAsync(async (req: Request, res: Response) => {
  const turf = await turfService.getTurfBySlug(req.params.slug);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Turf retrieved successfully.',
    data: turf,
  });
});

export const getTurfById = catchAsync(async (req: Request, res: Response) => {
  const turf = await turfService.getTurfById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Turf retrieved successfully.',
    data: turf,
  });
});

export const updateTurf = catchAsync(async (req: Request, res: Response) => {
  const turf = await turfService.updateTurf(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Turf updated successfully.',
    data: turf,
  });
});

export const deleteTurf = catchAsync(async (req: Request, res: Response) => {
  await turfService.deleteTurf(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Turf deleted successfully.',
  });
});
