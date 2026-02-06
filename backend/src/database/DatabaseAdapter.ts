/**
 * Database Adapter Interface
 * 
 * This interface abstracts the database operations.
 * Implement this interface for different databases (SQLite, PostgreSQL, MySQL, MongoDB, etc.)
 */

import { User, CreateUserDTO, UpdateUserDTO } from '../models/User.js';
import { PasswordReset, CreatePasswordResetDTO } from '../models/PasswordReset.js';
import { Testimony, CreateTestimonyDTO, UpdateTestimonyDTO } from '../models/Testimony.js';

// Simple interfaces for read-only entities (for now)
export interface Group {
  id: string;
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  address: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  groupId: string;
  groupName: string;
  role: string;
  photoUrl: string | null;
  joinedAt: string;
  isActive: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  leaderName: string;
  memberCount: number;
  isActive: boolean;
}

export interface Withdrawal {
  id: string;
  memberId: string;
  memberName: string;
  groupId: string;
  groupName: string;
  reason: string;
  date: string;
  notes: string;
}

export interface DatabaseAdapter {
  // Connection
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  // Users
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserDTO): Promise<User>;
  updateUser(id: string, data: UpdateUserDTO): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  
  // Password Reset
  createPasswordReset(data: CreatePasswordResetDTO): Promise<PasswordReset>;
  findPasswordResetByToken(token: string): Promise<PasswordReset | null>;
  markPasswordResetUsed(id: string): Promise<void>;
  deleteExpiredPasswordResets(): Promise<void>;
  
  // Testimonies
  findAllTestimonies(): Promise<Testimony[]>;
  findTestimonyById(id: string): Promise<Testimony | null>;
  findTestimoniesByGroup(groupId: string): Promise<Testimony[]>;
  findHighlightedTestimonies(): Promise<Testimony[]>;
  findFavoriteTestimonies(): Promise<Testimony[]>;
  createTestimony(data: CreateTestimonyDTO): Promise<Testimony>;
  updateTestimony(id: string, data: UpdateTestimonyDTO): Promise<Testimony | null>;
  deleteTestimony(id: string): Promise<boolean>;

  // Groups (read-only for now)
  findAllGroups(): Promise<Group[]>;
  findGroupById(id: string): Promise<Group | null>;

  // Members (read-only for now)
  findAllMembers(): Promise<Member[]>;
  findMemberById(id: string): Promise<Member | null>;

  // Ministries (read-only for now)
  findAllMinistries(): Promise<Ministry[]>;
  findMinistryById(id: string): Promise<Ministry | null>;

  // Withdrawals (read-only for now)
  findAllWithdrawals(): Promise<Withdrawal[]>;
  findWithdrawalById(id: string): Promise<Withdrawal | null>;
}
