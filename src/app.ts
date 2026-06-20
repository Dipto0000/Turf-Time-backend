import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import slotRoutes from './modules/slot/slot.routes';
import bookingRoutes from './modules/booking/booking.routes';
import adminRoutes from './modules/admin/admin.routes';
import turfRoutes from './modules/turf/turf.routes';

const app = express();

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Turf Time API is running.',
    version: 'v1',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      turfs: '/api/v1/turfs',
      slots: '/api/v1/slots',
      bookings: '/api/v1/bookings',
      admin: '/api/v1/admin',
    },
  });
});

app.get('/api/v1', (_req: Request, res: Response) => {
  res.redirect('/');
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Turf Time API is running.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/turfs', turfRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, 'The requested resource was not found.'));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof createError.HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';

  if (env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : {}),
  });
});

export default app;
