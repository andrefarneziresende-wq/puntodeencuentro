/**
 * Auth Service
 * 
 * Business logic for authentication.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/UserRepository.js';
import { passwordResetRepository } from '../repositories/PasswordResetRepository.js';
import { User, UserResponse, toUserResponse } from '../models/User.js';

interface LoginResult {
  success: boolean;
  user?: UserResponse;
  token?: string;
  error?: string;
}

interface RegisterResult {
  success: boolean;
  user?: UserResponse;
  token?: string;
  error?: string;
}

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<RegisterResult> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return { success: false, error: 'El email ya está registrado.' };
    }

    // Validate password
    if (password.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      success: true,
      user: toUserResponse(user),
      token,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResult> {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' };
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' };
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      success: true,
      user: toUserResponse(user),
      token,
    };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    const user = await userRepository.findByEmail(email);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true };
    }

    // Generate reset token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await passwordResetRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    // In production, send email here
    // For now, log the reset link
    const resetLink = `${config.frontendUrl}/nueva-contrasena?token=${token}`;
    console.log(`📧 Password reset link for ${email}: ${resetLink}`);

    return { success: true };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    // Validate password
    if (newPassword.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    // Find reset request
    const resetRequest = await passwordResetRepository.findByToken(token);
    if (!resetRequest) {
      return { success: false, error: 'El enlace ha expirado o no es válido.' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Update user password
    await userRepository.update(resetRequest.userId, { password: hashedPassword });

    // Mark token as used
    await passwordResetRepository.markUsed(resetRequest.id);

    return { success: true };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { valid: boolean; userId?: string } {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      return { valid: true, userId: decoded.userId };
    } catch {
      return { valid: false };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await userRepository.findById(id);
    return user ? toUserResponse(user) : null;
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      return { success: false, error: 'Usuario no encontrado.' };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return { success: false, error: 'Contraseña actual incorrecta.' };
    }

    // Validate new password
    if (newPassword.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    // Hash and update
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await userRepository.update(userId, { password: hashedPassword });

    return { success: true };
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }
}

// Singleton instance
export const authService = new AuthService();
