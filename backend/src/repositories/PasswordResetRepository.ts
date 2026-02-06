/**
 * Password Reset Repository
 * 
 * Data access layer for PasswordReset entity.
 */

import { getDatabase } from '../database/index.js';
import { PasswordReset, CreatePasswordResetDTO } from '../models/PasswordReset.js';

export class PasswordResetRepository {
  async create(data: CreatePasswordResetDTO): Promise<PasswordReset> {
    const db = getDatabase();
    return db.createPasswordReset(data);
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    const db = getDatabase();
    return db.findPasswordResetByToken(token);
  }

  async markUsed(id: string): Promise<void> {
    const db = getDatabase();
    await db.markPasswordResetUsed(id);
  }

  async cleanupExpired(): Promise<void> {
    const db = getDatabase();
    await db.deleteExpiredPasswordResets();
  }
}

// Singleton instance
export const passwordResetRepository = new PasswordResetRepository();
