import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getStringQuery, getNumQuery } from '../../utils/queryHelper';
import { AuthRequest } from '../../utils/checkAuth';
import * as bookingService from './booking.service';

export const createBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const { slotIds, phone, date, note } = req.body;

  if (!slotIds || !slotIds.length) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Please select at least one slot.',
    });
  }

  if (!phone) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Phone number is required for booking.',
    });
  }

  if (!date) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'Date is required.',
    });
  }

  const booking = await bookingService.createBooking({
    userId: req.user!.userId,
    slotIds,
    phone,
    date,
    note,
  });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Booking confirmed successfully.',
    data: booking,
  });
});

export const getMyBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await bookingService.getMyBookings(req.user!.userId, {
    page: getNumQuery(req.query.page),
    limit: getNumQuery(req.query.limit),
    status: getStringQuery(req.query.status),
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Bookings retrieved successfully.',
    data: result.bookings,
    meta: result.meta,
  });
});

export const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.getAllBookings({
    page: getNumQuery(req.query.page),
    limit: getNumQuery(req.query.limit),
    status: getStringQuery(req.query.status),
    date: getStringQuery(req.query.date),
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All bookings retrieved successfully.',
    data: result.bookings,
    meta: result.meta,
  });
});

export const cancelBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user?.userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Booking cancelled successfully.',
    data: booking,
  });
});

export const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Booking retrieved successfully.',
    data: booking,
  });
});
