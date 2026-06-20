import mongoose from 'mongoose';
import Turf from '../models/Turf';
import { env } from '../config/env';

const turfData = [
  {
    name: 'Green Field Arena',
    description: 'A premium 7-a-side football turf with professional-grade artificial grass. Perfect for competitive matches and training sessions. The field features proper drainage, floodlights for evening games, and comfortable seating for spectators. Our flagship turf is maintained daily to ensure the best playing experience.',
    shortDescription: 'Premium 7-a-side football turf with floodlights and seating',
    images: [
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    ],
    location: 'Gulshan, Dhaka',
    pricePerHour: 1500,
    capacity: 14,
    size: '7-a-side',
    amenities: ['Floodlights', 'Changing Rooms', 'Parking', 'Water Supply', 'Seating Area'],
    rules: ['No studded boots', 'No food on field', 'Proper sportswear required'],
    featured: true,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    name: 'Sunset Football Hub',
    description: 'A well-maintained 5-a-side turf located in the heart of Banani. The compact size is perfect for quick matches and small group training. Equipped with modern amenities including floodlights, changing facilities, and a small cafe area for refreshments.',
    shortDescription: 'Compact 5-a-side turf ideal for quick matches',
    images: [
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800',
      'https://images.unsplash.com/photo-1520962922320-2038eebab146?w=800',
      'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800',
    ],
    location: 'Banani, Dhaka',
    pricePerHour: 1200,
    capacity: 10,
    size: '5-a-side',
    amenities: ['Floodlights', 'Changing Rooms', 'Cafe', 'Parking', 'WiFi'],
    rules: ['No smoking', 'Proper footwear required', 'Booking required'],
    featured: true,
    rating: 4.6,
    reviewCount: 98,
  },
  {
    name: 'Cricket Green Ground',
    description: 'A spacious multi-purpose turf suitable for cricket practice and small matches. The ground features a natural grass surface with concrete pitch strips. Ideal for weekend tournaments and coaching camps with ample space for fielding practice.',
    shortDescription: 'Multi-purpose ground for cricket practice and matches',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
    ],
    location: 'Uttara, Dhaka',
    pricePerHour: 2000,
    capacity: 22,
    size: 'Large Ground',
    amenities: ['Practice Nets', 'Floodlights', 'Pavilion', 'Parking', 'Scoreboard'],
    rules: ['No spikes', 'Equipment provided', 'Booking required'],
    featured: false,
    rating: 4.7,
    reviewCount: 72,
  },
  {
    name: 'Badminton Pro Court',
    description: 'Professional indoor badminton courts with synthetic flooring and proper lighting. The air-conditioned environment ensures comfortable play year-round. Courts are marked for both singles and doubles play with international standard measurements.',
    shortDescription: 'AC indoor badminton courts with synthetic flooring',
    images: [
      'https://images.unsplash.com/photo-1613919113640-25708f0f7c0d?w=800',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    ],
    location: 'Dhanmondi, Dhaka',
    pricePerHour: 800,
    capacity: 4,
    size: 'Standard Court',
    amenities: ['Air Conditioning', 'Equipment Rental', 'Changing Rooms', 'Parking', 'Pro Shop'],
    rules: ['Non-marking shoes required', 'Rackets available for rent', 'Shuttlecocks provided'],
    featured: true,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    name: 'Basketball Arena Dhaka',
    description: 'A full-size outdoor basketball court with professional hoops and markings. The court surface is made of high-quality acrylic for excellent ball bounce and player traction. Floodlights enable night play and there are bleachers for spectators.',
    shortDescription: 'Full-size outdoor basketball court with floodlights',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800',
    ],
    location: 'Mirpur, Dhaka',
    pricePerHour: 1000,
    capacity: 10,
    size: 'Full Court',
    amenities: ['Floodlights', 'Bleachers', 'Water Fountain', 'Parking', 'Ball Rental'],
    rules: ['Indoor shoes only', 'No food on court', 'Team booking preferred'],
    featured: false,
    rating: 4.5,
    reviewCount: 64,
  },
  {
    name: 'Squash Supreme Court',
    description: 'International standard squash court with glass back wall for spectators. The court features maple wood flooring, proper ventilation, and professional lighting. A viewing gallery allows friends and family to watch matches comfortably.',
    shortDescription: 'Professional squash court with glass back wall',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
      'https://images.unsplash.com/photo-1613408346815-12dc0b9e0e67?w=800',
      'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800',
    ],
    location: 'Gulshan, Dhaka',
    pricePerHour: 1200,
    capacity: 4,
    size: 'Standard Court',
    amenities: ['Glass Back Wall', 'AC', 'Viewing Gallery', 'Equipment Rental', 'Showers'],
    rules: ['Non-marking shoes required', 'Eye protection recommended', 'Booking required'],
    featured: false,
    rating: 4.7,
    reviewCount: 89,
  },
];

export const seedTurfs = async () => {
  const existingCount = await Turf.countDocuments();
  if (existingCount > 0) {
    console.log('Turfs already seeded. Skipping.');
    return;
  }

  await Turf.insertMany(turfData);
  console.log(`Seeded ${turfData.length} turfs successfully.`);
};
