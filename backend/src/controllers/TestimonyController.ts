/**
 * Testimony Controller
 */

import { Request, Response } from 'express';
import { testimonyService } from '../services/TestimonyService.js';

export class TestimonyController {
  /**
   * GET /api/testimonies
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const testimonies = await testimonyService.getAll();
      res.json({ testimonies });
    } catch (error) {
      console.error('Get testimonies error:', error);
      res.status(500).json({ error: 'Error al obtener testimonios.' });
    }
  }

  /**
   * GET /api/testimonies/highlighted
   */
  async getHighlighted(req: Request, res: Response): Promise<void> {
    try {
      const testimonies = await testimonyService.getHighlighted();
      res.json({ testimonies });
    } catch (error) {
      console.error('Get highlighted error:', error);
      res.status(500).json({ error: 'Error al obtener testimonios destacados.' });
    }
  }

  /**
   * GET /api/testimonies/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const testimony = await testimonyService.getById(id);

      if (!testimony) {
        res.status(404).json({ error: 'Testimonio no encontrado.' });
        return;
      }

      res.json({ testimony });
    } catch (error) {
      console.error('Get testimony error:', error);
      res.status(500).json({ error: 'Error al obtener testimonio.' });
    }
  }

  /**
   * POST /api/testimonies
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, groupId, groupName } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Título y contenido son requeridos.' });
        return;
      }

      const testimony = await testimonyService.create({
        title,
        content,
        groupId: groupId || 'default',
        groupName: groupName || 'Casa de Samuel',
        authorId: req.userId || 'anonymous',
        authorName: 'Usuario',
      });

      res.status(201).json({
        message: 'Testimonio creado correctamente.',
        testimony,
      });
    } catch (error) {
      console.error('Create testimony error:', error);
      res.status(500).json({ error: 'Error al crear testimonio.' });
    }
  }

  /**
   * PUT /api/testimonies/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const testimony = await testimonyService.update(id, { title, content });

      if (!testimony) {
        res.status(404).json({ error: 'Testimonio no encontrado.' });
        return;
      }

      res.json({
        message: 'Testimonio actualizado correctamente.',
        testimony,
      });
    } catch (error) {
      console.error('Update testimony error:', error);
      res.status(500).json({ error: 'Error al actualizar testimonio.' });
    }
  }

  /**
   * POST /api/testimonies/:id/favorite
   */
  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const testimony = await testimonyService.markAsFavoriteByResponsible(id);

      if (!testimony) {
        res.status(404).json({ error: 'Testimonio no encontrado.' });
        return;
      }

      res.json({
        message: testimony.isFavoriteByResponsible
          ? 'Marcado como favorito.'
          : 'Desmarcado como favorito.',
        testimony,
      });
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ error: 'Error al marcar favorito.' });
    }
  }

  /**
   * POST /api/testimonies/:id/highlight
   */
  async toggleHighlight(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { highlighted } = req.body;

      const testimony = await testimonyService.markAsHighlighted(id, highlighted !== false);

      if (!testimony) {
        res.status(404).json({ error: 'Testimonio no encontrado.' });
        return;
      }

      res.json({
        message: testimony.isHighlighted
          ? 'Destacado para toda la iglesia.'
          : 'Quitado de destacados.',
        testimony,
      });
    } catch (error) {
      console.error('Toggle highlight error:', error);
      res.status(500).json({ error: 'Error al destacar testimonio.' });
    }
  }

  /**
   * DELETE /api/testimonies/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await testimonyService.delete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Testimonio no encontrado.' });
        return;
      }

      res.json({ message: 'Testimonio eliminado correctamente.' });
    } catch (error) {
      console.error('Delete testimony error:', error);
      res.status(500).json({ error: 'Error al eliminar testimonio.' });
    }
  }
}

export const testimonyController = new TestimonyController();
