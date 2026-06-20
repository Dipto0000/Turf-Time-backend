import mongoose from 'mongoose';
import { seedSuperAdmin } from './seedSuperAdmin';
import { seedTurfs } from './turfData';
import { env } from '../config/env';

const seedAll = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    await seedSuperAdmin();
    await seedTurfs();

    console.log('Seeding completed successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedAll();
