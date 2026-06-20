import createError from 'http-errors';
import Slot from '../../models/Slot';

interface CreateSlotData {
  turfId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

const calculatePrice = (duration: number): number => {
  if (duration <= 60) return 1500;
  if (duration <= 120) return 2500;
  if (duration <= 180) return 4000;
  return 6000;
};

export const createSlot = async (data: CreateSlotData) => {
  const price = data.price || calculatePrice(data.duration);

  const existingSlot = await Slot.findOne({
    turf: data.turfId,
    date: new Date(data.date + 'T00:00:00'),
    startTime: data.startTime,
  });

  if (existingSlot) {
    throw createError(400, 'A slot with this date and time already exists for this turf.');
  }

  const slot = await Slot.create({
    turf: data.turfId,
    date: new Date(data.date + 'T00:00:00'),
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.duration,
    price,
  });

  return slot;
};

export const getSlotsByDate = async (turfId: string, dateStr: string) => {
  const startDate = new Date(dateStr + 'T00:00:00');
  const endDate = new Date(dateStr + 'T23:59:59.999');

  const slots = await Slot.find({
    turf: turfId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ startTime: 1 }).populate('turf', 'name slug');

  return slots;
};

export const getAllSlots = async (query: {
  page?: number;
  limit?: number;
  turfId?: string;
  date?: string;
  isBooked?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.turfId) {
    filter.turf = query.turfId;
  }

  if (query.date) {
    const startDate = new Date(query.date + 'T00:00:00');
    const endDate = new Date(query.date + 'T23:59:59.999');
    filter.date = { $gte: startDate, $lte: endDate };
  }

  if (query.isBooked !== undefined) {
    filter.isBooked = query.isBooked === 'true';
  }

  const sortObj: Record<string, 1 | -1> = {};
  if (query.sortBy) {
    sortObj[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
  } else {
    sortObj.date = 1;
    sortObj.startTime = 1;
  }

  const [slots, total] = await Promise.all([
    Slot.find(filter).sort(sortObj).skip(skip).limit(limit).populate('turf', 'name slug'),
    Slot.countDocuments(filter),
  ]);

  return {
    slots,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const generateSlotsForDate = async (turfId: string, dateStr: string) => {
  const timeSlots = [
    { startTime: '06:00', endTime: '07:00', duration: 60 },
    { startTime: '07:00', endTime: '08:00', duration: 60 },
    { startTime: '08:00', endTime: '09:00', duration: 60 },
    { startTime: '09:00', endTime: '10:00', duration: 60 },
    { startTime: '10:00', endTime: '11:00', duration: 60 },
    { startTime: '11:00', endTime: '12:00', duration: 60 },
    { startTime: '14:00', endTime: '15:00', duration: 60 },
    { startTime: '15:00', endTime: '16:00', duration: 60 },
    { startTime: '16:00', endTime: '17:00', duration: 60 },
    { startTime: '17:00', endTime: '18:00', duration: 60 },
    { startTime: '18:00', endTime: '19:00', duration: 60 },
    { startTime: '19:00', endTime: '20:00', duration: 60 },
    { startTime: '20:00', endTime: '21:00', duration: 60 },
    { startTime: '21:00', endTime: '22:00', duration: 60 },
    { startTime: '06:00', endTime: '08:00', duration: 120, price: 2500 },
    { startTime: '08:00', endTime: '10:00', duration: 120, price: 2500 },
    { startTime: '14:00', endTime: '17:00', duration: 180, price: 4000 },
    { startTime: '17:00', endTime: '20:00', duration: 180, price: 4000 },
    { startTime: '06:00', endTime: '12:00', duration: 360, price: 6000, label: 'Half Day' },
  ];

  const existingSlots = await Slot.countDocuments({
    turf: turfId,
    date: { $gte: new Date(dateStr + 'T00:00:00'), $lte: new Date(dateStr + 'T23:59:59.999') },
  });

  if (existingSlots > 0) {
    throw createError(400, 'Slots already generated for this date.');
  }

  const slotsToCreate = timeSlots.map((slot) => {
    const price = slot.price || calculatePrice(slot.duration);
    return {
      turf: turfId,
      date: new Date(dateStr + 'T00:00:00'),
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      price,
    };
  });

  const slots = await Slot.insertMany(slotsToCreate);
  return slots;
};

export const getSlotById = async (slotId: string) => {
  const slot = await Slot.findById(slotId).populate('turf', 'name slug');
  if (!slot) {
    throw createError(404, 'Slot not found.');
  }
  return slot;
};

export const updateSlot = async (slotId: string, data: Record<string, unknown>) => {
  const updateData: Record<string, unknown> = {};
  if (data.turfId) updateData.turf = data.turfId;
  if (data.date) updateData.date = new Date((data.date as string) + 'T00:00:00');
  if (data.startTime) updateData.startTime = data.startTime;
  if (data.endTime) updateData.endTime = data.endTime;
  if (data.duration) updateData.duration = data.duration;
  if (data.price) updateData.price = data.price;

  const slot = await Slot.findByIdAndUpdate(slotId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!slot) {
    throw createError(404, 'Slot not found.');
  }

  return slot;
};

export const deleteSlot = async (slotId: string) => {
  const slot = await Slot.findByIdAndDelete(slotId);
  if (!slot) {
    throw createError(404, 'Slot not found.');
  }
  return slot;
};
