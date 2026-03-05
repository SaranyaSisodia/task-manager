import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../types';

export const authService = {
  // Creates a new user account
  // Hashes the password and stores refresh token in DB
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Never store plain passwords — hash with bcrypt (12 rounds = very secure)
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token so we can invalidate it on logout
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  },

  // Verifies credentials and returns tokens
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Vague error message — don't reveal whether email exists
    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  },

  // Issues a new access token using a valid refresh token
  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    // Also check the token matches what's in the DB (invalidated on logout)
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, refreshToken },
    });

    if (!user) throw new Error('Invalid refresh token');

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    return { accessToken };
  },

  // Clears the stored refresh token — effectively logs the user out
  async logout(userId: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },
};
