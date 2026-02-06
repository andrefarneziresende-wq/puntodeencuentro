/**
 * User Repository
 * 
 * Data access layer for User entity.
 * Uses the database adapter for actual operations.
 */

import { getDatabase } from '../database/index.js';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/User.js';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const db = getDatabase();
    return db.findUserById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    return db.findUserByEmail(email);
  }

  async create(data: CreateUserDTO): Promise<User> {
    const db = getDatabase();
    return db.createUser(data);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    const db = getDatabase();
    return db.updateUser(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    return db.deleteUser(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}

// Singleton instance
export const userRepository = new UserRepository();
