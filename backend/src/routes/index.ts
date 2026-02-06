/**
 * Main Router
 */

import { Router } from 'express';
import authRoutes from './auth.js';
import testimonyRoutes from './testimonies.js';
import dataRoutes from './data.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Punto de Encuentro API'
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/testimonies', testimonyRoutes);
router.use('/', dataRoutes);

export default router;
