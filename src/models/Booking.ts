import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  slots: mongoose.Types.ObjectId[];
  totalCost: number;
  totalDuration: number;
  phone: string;
  date: Date;
  status: 'confirmed' | 'cancelled' | 'completed';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    slots: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Slot',
        required: [true, 'At least one slot is required'],
      },
    ],
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
    },
    totalDuration: {
      type: Number,
      required: [true, 'Total duration is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, date: -1 });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
