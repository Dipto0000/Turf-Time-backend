import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import User, { IUser } from '../../models/User';
import { generateToken, generateRefreshToken } from '../../utils/jwt';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw createError(400, 'User with this email already exists.');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
  });

  const tokenPayload = { userId: user._id.toString(), role: user.role };
  const token = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  return { user: userWithoutPassword, token, refreshToken };
};

export const loginUser = async (data: LoginData) => {
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) {
    throw createError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw createError(401, 'Your account has been deactivated. Contact support.');
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw createError(401, 'Invalid email or password.');
  }

  const tokenPayload = { userId: user._id.toString(), role: user.role };
  const token = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  return { user: userWithoutPassword, token, refreshToken };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }
  return user;
};

export const updateProfile = async (userId: string, data: Partial<IUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }

  if (data.name) user.name = data.name;
  if (data.phone) user.phone = data.phone;
  if (data.avatar) user.avatar = data.avatar;
  if (data.password) user.password = data.password;

  await user.save();

  return user;
};
