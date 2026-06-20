import mongoose, { Document, Schema } from 'mongoose';

export interface ITurf extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  location: string;
  pricePerHour: number;
  pricePerSlot: {
    duration: number;
    price: number;
    label: string;
  }[];
  capacity: number;
  size: string;
  amenities: string[];
  rules: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const turfSchema = new Schema<ITurf>(
  {
    name: {
      type: String,
      required: [true, 'Turf name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 200,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
    },
    pricePerSlot: [
      {
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        label: { type: String, required: true },
      },
    ],
    capacity: {
      type: Number,
      default: 10,
    },
    size: {
      type: String,
      default: 'Standard',
    },
    amenities: {
      type: [String],
      default: [],
    },
    rules: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

turfSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
});

const Turf = mongoose.model<ITurf>('Turf', turfSchema);
export default Turf;
