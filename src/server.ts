import mongoose from 'mongoose';
import app from './app';
import { seedSuperAdmin } from './seeds/seedSuperAdmin';
import { env } from './config/env';

const startServer = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    await seedSuperAdmin();

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
      console.log(`API: http://localhost:${env.PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
