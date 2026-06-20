import mongoose from 'mongoose';
import { seedSuperAdmin } from './seedSuperAdmin';
import { env } from '../config/env';

const run = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    await seedSuperAdmin();

    await mongoose.disconnect();
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding super admin:', error);
    process.exit(1);
  }
};

run();
