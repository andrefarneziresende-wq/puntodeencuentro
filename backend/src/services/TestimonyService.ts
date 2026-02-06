/**
 * Testimony Service
 */

import { testimonyRepository } from '../repositories/TestimonyRepository.js';
import { TestimonyResponse, toTestimonyResponse, CreateTestimonyDTO } from '../models/Testimony.js';

export class TestimonyService {
  async getAll(): Promise<TestimonyResponse[]> {
    const testimonies = await testimonyRepository.findAll();
    return testimonies.map(toTestimonyResponse);
  }

  async getById(id: string): Promise<TestimonyResponse | null> {
    const testimony = await testimonyRepository.findById(id);
    return testimony ? toTestimonyResponse(testimony) : null;
  }

  async getHighlighted(): Promise<TestimonyResponse[]> {
    const testimonies = await testimonyRepository.findHighlighted();
    return testimonies.map(toTestimonyResponse);
  }

  async getFavorites(): Promise<TestimonyResponse[]> {
    const testimonies = await testimonyRepository.findFavorites();
    return testimonies.map(toTestimonyResponse);
  }

  async create(data: CreateTestimonyDTO): Promise<TestimonyResponse> {
    const testimony = await testimonyRepository.create(data);
    return toTestimonyResponse(testimony);
  }

  async update(id: string, data: Partial<CreateTestimonyDTO>): Promise<TestimonyResponse | null> {
    const testimony = await testimonyRepository.update(id, data);
    return testimony ? toTestimonyResponse(testimony) : null;
  }

  async markAsFavoriteByResponsible(id: string): Promise<TestimonyResponse | null> {
    const testimony = await testimonyRepository.findById(id);
    if (!testimony) return null;

    const updated = await testimonyRepository.update(id, {
      isFavoriteByResponsible: !testimony.isFavoriteByResponsible,
    });

    // TODO: Send notification to admin when marked as favorite
    if (updated?.isFavoriteByResponsible) {
      console.log(`📧 Notificar admin: Nuevo testimonio favorito "${updated.title}"`);
    }

    return updated ? toTestimonyResponse(updated) : null;
  }

  async markAsFavoriteByAdmin(id: string): Promise<TestimonyResponse | null> {
    const testimony = await testimonyRepository.update(id, {
      isFavoriteByAdmin: true,
    });
    return testimony ? toTestimonyResponse(testimony) : null;
  }

  async markAsHighlighted(id: string, highlighted: boolean): Promise<TestimonyResponse | null> {
    const testimony = await testimonyRepository.update(id, {
      isHighlighted: highlighted,
    });
    return testimony ? toTestimonyResponse(testimony) : null;
  }

  async delete(id: string): Promise<boolean> {
    return testimonyRepository.delete(id);
  }
}

export const testimonyService = new TestimonyService();
