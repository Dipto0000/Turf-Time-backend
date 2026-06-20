import createError from 'http-errors';
import mongoose from 'mongoose';
import Booking from '../../models/Booking';
import Slot from '../../models/Slot';

interface CreateBookingData {
  userId: string;
  slotIds: string[];
  phone: string;
  date: string;
  note?: string;
}

export const createBooking = async (data: CreateBookingData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const slots = await Slot.find({
      _id: { $in: data.slotIds },
      date: new Date(data.date),
    }).session(session);

    if (slots.length !== data.slotIds.length) {
      throw createError(400, 'Some slots were not found.');
    }

    const bookedSlots = slots.filter((slot) => slot.isBooked);
    if (bookedSlots.length > 0) {
      throw createError(400, `Slot(s) ${bookedSlots.map((s) => s.startTime).join(', ')} are already booked.`);
    }

    const totalCost = slots.reduce((sum, slot) => sum + slot.price, 0);
    const totalDuration = slots.reduce((sum, slot) => sum + slot.duration, 0);

    const [booking] = await Booking.create(
      [
        {
          user: data.userId,
          slots: data.slotIds,
          totalCost,
          totalDuration,
          phone: data.phone,
          date: new Date(data.date),
          note: data.note,
        },
      ],
      { session }
    );

    await Slot.updateMany(
      { _id: { $in: data.slotIds } },
      {
        $set: {
          isBooked: true,
          bookedBy: data.userId,
          booking: booking._id,
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedBooking = await Booking.findById(booking._id).populate('slots');

    return populatedBooking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getMyBookings = async (userId: string, query: { page?: number; limit?: number; status?: string }) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { user: userId };
  if (query.status) {
    filter.status = query.status;
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('slots')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllBookings = async (query: {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.date) {
    const startDate = new Date(query.date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(query.date);
    endDate.setHours(23, 59, 59, 999);
    filter.date = { $gte: startDate, $lte: endDate };
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('slots')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const cancelBooking = async (bookingId: string, userId?: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw createError(404, 'Booking not found.');
  }

  if (userId && booking.user.toString() !== userId) {
    throw createError(403, 'You can only cancel your own bookings.');
  }

  booking.status = 'cancelled';
  await booking.save();

  await Slot.updateMany(
    { booking: bookingId },
    {
      $set: {
        isBooked: false,
        bookedBy: null,
        booking: null,
      },
    }
  );

  return booking;
};

export const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate('slots')
    .populate('user', 'name email phone');
  if (!booking) {
    throw createError(404, 'Booking not found.');
  }
  return booking;
};
