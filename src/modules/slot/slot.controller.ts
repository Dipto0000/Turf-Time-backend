import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getStringQuery, getNumQuery } from '../../utils/queryHelper';
import * as slotService from './slot.service';

export const createSlot = catchAsync(async (req: Request, res: Response) => {
  const slot = await slotService.createSlot(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Slot created successfully.',
    data: slot,
  });
});

export const getSlotsByDate = catchAsync(async (req: Request, res: Response) => {
  const dateParam = getStringQuery(req.query.date);
  const turfId = getStringQuery(req.query.turfId);

  if (!dateParam) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Date query parameter is required.',
    });
  }

  if (!turfId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'turfId query parameter is required.',
    });
  }

  const slots = await slotService.getSlotsByDate(turfId, dateParam);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slots retrieved successfully.',
    data: slots,
  });
});

export const generateSlots = catchAsync(async (req: Request, res: Response) => {
  const { turfId, date } = req.body;
  if (!turfId || !date) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'turfId and date are required.',
    });
  }
  const slots = await slotService.generateSlotsForDate(turfId, date);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Slots generated successfully.',
    data: slots,
  });
});

export const getAllSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await slotService.getAllSlots({
    page: getNumQuery(req.query.page),
    limit: getNumQuery(req.query.limit),
    turfId: getStringQuery(req.query.turfId),
    date: getStringQuery(req.query.date),
    isBooked: getStringQuery(req.query.isBooked),
    sortBy: getStringQuery(req.query.sortBy),
    sortOrder: getStringQuery(req.query.sortOrder),
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slots retrieved successfully.',
    data: result.slots,
    meta: result.meta,
  });
});

export const getSlotById = catchAsync(async (req: Request, res: Response) => {
  const slot = await slotService.getSlotById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slot retrieved successfully.',
    data: slot,
  });
});

export const updateSlot = catchAsync(async (req: Request, res: Response) => {
  const slot = await slotService.updateSlot(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slot updated successfully.',
    data: slot,
  });
});

export const deleteSlot = catchAsync(async (req: Request, res: Response) => {
  await slotService.deleteSlot(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slot deleted successfully.',
  });
});
