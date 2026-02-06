/**
 * Testimony Routes
 */

import { Router } from 'express';
import { testimonyController } from '../controllers/TestimonyController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes (with optional auth)
router.get('/', optionalAuth, (req, res) => testimonyController.getAll(req, res));
router.get('/highlighted', (req, res) => testimonyController.getHighlighted(req, res));
router.get('/:id', optionalAuth, (req, res) => testimonyController.getById(req, res));

// Protected routes
router.post('/', authenticate, (req, res) => testimonyController.create(req, res));
router.put('/:id', authenticate, (req, res) => testimonyController.update(req, res));
router.post('/:id/favorite', authenticate, (req, res) => testimonyController.toggleFavorite(req, res));
router.post('/:id/highlight', authenticate, (req, res) => testimonyController.toggleHighlight(req, res));
router.delete('/:id', authenticate, (req, res) => testimonyController.delete(req, res));

export default router;
