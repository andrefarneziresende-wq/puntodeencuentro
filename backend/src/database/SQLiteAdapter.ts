/**
 * SQLite Database Adapter
 * 
 * Uses a simple JSON file as database for simplicity.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseAdapter, Group, Member, Ministry, Withdrawal } from './DatabaseAdapter.js';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/User.js';
import { PasswordReset, CreatePasswordResetDTO } from '../models/PasswordReset.js';
import { Testimony, CreateTestimonyDTO, UpdateTestimonyDTO } from '../models/Testimony.js';
import { config } from '../config/index.js';

interface DatabaseSchema {
  users: User[];
  passwordResets: PasswordReset[];
  testimonies: Testimony[];
  groups: Group[];
  members: Member[];
  ministries: Ministry[];
  withdrawals: Withdrawal[];
}

export class SQLiteAdapter implements DatabaseAdapter {
  private dbPath: string;
  private data: DatabaseSchema = { 
    users: [], 
    passwordResets: [], 
    testimonies: [],
    groups: [],
    members: [],
    ministries: [],
    withdrawals: []
  };

  constructor() {
    this.dbPath = path.resolve(config.database.path.replace('.sqlite', '.json'));
  }

  async connect(): Promise<void> {
    const dir = path.dirname(this.dbPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.dbPath)) {
      const content = fs.readFileSync(this.dbPath, 'utf-8');
      this.data = JSON.parse(content);
      // Ensure arrays exist
      if (!this.data.testimonies) this.data.testimonies = [];
      if (!this.data.groups) this.data.groups = [];
      if (!this.data.members) this.data.members = [];
      if (!this.data.ministries) this.data.ministries = [];
      if (!this.data.withdrawals) this.data.withdrawals = [];
    } else {
      this.save();
    }

    console.log('📦 Database connected (JSON file)');
  }

  async disconnect(): Promise<void> {
    this.save();
    console.log('📦 Database disconnected');
  }

  private save(): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
  }

  // Users
  async findUserById(id: string): Promise<User | null> {
    return this.data.users.find(u => u.id === id) || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.data.users.push(user);
    this.save();
    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const user = this.data.users[index];
    const updated: User = {
      ...user,
      ...data,
      email: data.email ? data.email.toLowerCase() : user.email,
      updatedAt: new Date(),
    };

    this.data.users[index] = updated;
    this.save();
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    this.data.users.splice(index, 1);
    this.save();
    return true;
  }

  // Password Reset
  async createPasswordReset(data: CreatePasswordResetDTO): Promise<PasswordReset> {
    const reset: PasswordReset = {
      id: uuidv4(),
      userId: data.userId,
      token: data.token,
      expiresAt: data.expiresAt,
      used: false,
      createdAt: new Date(),
    };

    this.data.passwordResets.push(reset);
    this.save();
    return reset;
  }

  async findPasswordResetByToken(token: string): Promise<PasswordReset | null> {
    return this.data.passwordResets.find(
      r => r.token === token && !r.used && new Date(r.expiresAt) > new Date()
    ) || null;
  }

  async markPasswordResetUsed(id: string): Promise<void> {
    const index = this.data.passwordResets.findIndex(r => r.id === id);
    if (index !== -1) {
      this.data.passwordResets[index].used = true;
      this.save();
    }
  }

  async deleteExpiredPasswordResets(): Promise<void> {
    const now = new Date();
    this.data.passwordResets = this.data.passwordResets.filter(
      r => new Date(r.expiresAt) > now || r.used
    );
    this.save();
  }

  // Testimonies
  async findAllTestimonies(): Promise<Testimony[]> {
    return [...this.data.testimonies].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findTestimonyById(id: string): Promise<Testimony | null> {
    return this.data.testimonies.find(t => t.id === id) || null;
  }

  async findTestimoniesByGroup(groupId: string): Promise<Testimony[]> {
    return this.data.testimonies
      .filter(t => t.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findHighlightedTestimonies(): Promise<Testimony[]> {
    return this.data.testimonies
      .filter(t => t.isHighlighted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findFavoriteTestimonies(): Promise<Testimony[]> {
    return this.data.testimonies
      .filter(t => t.isFavoriteByResponsible || t.isFavoriteByAdmin)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTestimony(data: CreateTestimonyDTO): Promise<Testimony> {
    const testimony: Testimony = {
      id: uuidv4(),
      title: data.title,
      content: data.content,
      groupId: data.groupId,
      groupName: data.groupName,
      authorId: data.authorId,
      authorName: data.authorName,
      isFavoriteByResponsible: false,
      isFavoriteByAdmin: false,
      isHighlighted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.data.testimonies.push(testimony);
    this.save();
    return testimony;
  }

  async updateTestimony(id: string, data: UpdateTestimonyDTO): Promise<Testimony | null> {
    const index = this.data.testimonies.findIndex(t => t.id === id);
    if (index === -1) return null;

    const testimony = this.data.testimonies[index];
    const updated: Testimony = {
      ...testimony,
      ...data,
      updatedAt: new Date(),
    };

    this.data.testimonies[index] = updated;
    this.save();
    return updated;
  }

  async deleteTestimony(id: string): Promise<boolean> {
    const index = this.data.testimonies.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.data.testimonies.splice(index, 1);
    this.save();
    return true;
  }

  // Groups
  async findAllGroups(): Promise<Group[]> {
    return [...(this.data.groups || [])];
  }

  async findGroupById(id: string): Promise<Group | null> {
    return (this.data.groups || []).find(g => g.id === id) || null;
  }

  // Members
  async findAllMembers(): Promise<Member[]> {
    return [...(this.data.members || [])];
  }

  async findMemberById(id: string): Promise<Member | null> {
    return (this.data.members || []).find(m => m.id === id) || null;
  }

  // Ministries
  async findAllMinistries(): Promise<Ministry[]> {
    return [...(this.data.ministries || [])];
  }

  async findMinistryById(id: string): Promise<Ministry | null> {
    return (this.data.ministries || []).find(m => m.id === id) || null;
  }

  // Withdrawals
  async findAllWithdrawals(): Promise<Withdrawal[]> {
    return [...(this.data.withdrawals || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async findWithdrawalById(id: string): Promise<Withdrawal | null> {
    return (this.data.withdrawals || []).find(w => w.id === id) || null;
  }
}
