import { Router } from 'express';
import { authenticate, authorize } from '../../utils/checkAuth';
import * as bookingController from './booking.controller';

const router = Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/my-bookings', authenticate, bookingController.getMyBookings);
router.get('/all', authenticate, authorize('admin'), bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);

export default router;
