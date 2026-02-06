/**
 * Testimony Repository
 */

import { getDatabase } from '../database/index.js';
import { Testimony, CreateTestimonyDTO, UpdateTestimonyDTO } from '../models/Testimony.js';

export class TestimonyRepository {
  async findAll(): Promise<Testimony[]> {
    const db = getDatabase();
    return db.findAllTestimonies();
  }

  async findById(id: string): Promise<Testimony | null> {
    const db = getDatabase();
    return db.findTestimonyById(id);
  }

  async findByGroup(groupId: string): Promise<Testimony[]> {
    const db = getDatabase();
    return db.findTestimoniesByGroup(groupId);
  }

  async findHighlighted(): Promise<Testimony[]> {
    const db = getDatabase();
    return db.findHighlightedTestimonies();
  }

  async findFavorites(): Promise<Testimony[]> {
    const db = getDatabase();
    return db.findFavoriteTestimonies();
  }

  async create(data: CreateTestimonyDTO): Promise<Testimony> {
    const db = getDatabase();
    return db.createTestimony(data);
  }

  async update(id: string, data: UpdateTestimonyDTO): Promise<Testimony | null> {
    const db = getDatabase();
    return db.updateTestimony(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    return db.deleteTestimony(id);
  }
}

export const testimonyRepository = new TestimonyRepository();
