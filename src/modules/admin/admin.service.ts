import createError from 'http-errors';
import User from '../../models/User';
import Booking from '../../models/Booking';
import Slot from '../../models/Slot';

export const getAllUsers = async (query: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sortObj: Record<string, 1 | -1> = {};
  if (query.sortBy) {
    sortObj[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
  } else {
    sortObj.createdAt = -1;
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort(sortObj).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const promoteToAdmin = async (userId: string, currentUserId: string) => {
  if (userId === currentUserId) {
    throw createError(400, 'You cannot change your own role.');
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser || !currentUser.isSuperAdmin) {
    throw createError(403, 'Only super admin can promote users to admin.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }

  if (user.isSuperAdmin) {
    throw createError(400, 'Cannot change super admin role.');
  }

  user.role = 'admin';
  await user.save();

  return user;
};

export const toggleUserStatus = async (userId: string, currentUserId: string) => {
  if (userId === currentUserId) {
    throw createError(400, 'You cannot change your own status.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }

  if (user.isSuperAdmin) {
    throw createError(400, 'Cannot change super admin status.');
  }

  user.isActive = !user.isActive;
  await user.save();

  return user;
};

export const getDashboardStats = async () => {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalBookings,
    todayBookings,
    monthBookings,
    totalSlots,
    bookedSlots,
    totalRevenue,
    monthRevenue,
    recentBookings,
    revenueByMonth,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
    Booking.countDocuments({ createdAt: { $gte: monthStart } }),
    Slot.countDocuments(),
    Slot.countDocuments({ isBooked: true }),
    Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } },
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: monthStart }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } },
    ]),
    Booking.find()
      .populate('user', 'name email')
      .populate('slots')
      .sort({ createdAt: -1 })
      .limit(5),
    Booking.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalCost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
  ]);

  const statusDistribution = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const slotDurationDistribution = await Slot.aggregate([
    { $group: { _id: '$duration', count: { $sum: 1 }, total: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return {
    stats: {
      totalUsers,
      totalBookings,
      todayBookings,
      monthBookings,
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
    },
    recentBookings,
    revenueByMonth,
    statusDistribution,
    slotDurationDistribution,
  };
};
