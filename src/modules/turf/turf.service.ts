import createError from 'http-errors';
import Turf from '../../models/Turf';

interface CreateTurfData {
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  location: string;
  pricePerHour: number;
  capacity?: number;
  size?: string;
  amenities?: string[];
  rules?: string[];
  featured?: boolean;
}

export const createTurf = async (data: CreateTurfData) => {
  const pricePerSlot = [
    { duration: 60, price: 1500, label: '1 Hour' },
    { duration: 120, price: 2500, label: '2 Hours' },
    { duration: 180, price: 4000, label: '3 Hours' },
    { duration: 480, price: 6000, label: 'Full Day' },
  ];

  const turf = await Turf.create({
    ...data,
    pricePerSlot,
  });

  return turf;
};

export const getAllTurfs = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  featured?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { isActive: true };

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { location: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.featured === 'true') {
    filter.featured = true;
  }

  const sortObj: Record<string, 1 | -1> = {};
  if (query.sortBy) {
    sortObj[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
  } else {
    sortObj.createdAt = -1;
  }

  const [turfs, total] = await Promise.all([
    Turf.find(filter).sort(sortObj).skip(skip).limit(limit),
    Turf.countDocuments(filter),
  ]);

  return {
    turfs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTurfBySlug = async (slug: string) => {
  const turf = await Turf.findOne({ slug, isActive: true });
  if (!turf) {
    throw createError(404, 'Turf not found.');
  }
  return turf;
};

export const getTurfById = async (id: string) => {
  const turf = await Turf.findById(id);
  if (!turf) {
    throw createError(404, 'Turf not found.');
  }
  return turf;
};

export const updateTurf = async (id: string, data: Partial<CreateTurfData>) => {
  const turf = await Turf.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!turf) {
    throw createError(404, 'Turf not found.');
  }

  return turf;
};

export const deleteTurf = async (id: string) => {
  const turf = await Turf.findByIdAndDelete(id);
  if (!turf) {
    throw createError(404, 'Turf not found.');
  }
  return turf;
};
