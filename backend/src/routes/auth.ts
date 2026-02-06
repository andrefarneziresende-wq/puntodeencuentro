/**
 * Auth Routes
 */

import { Router } from 'express';
import { authController } from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// Protected routes
router.get('/me', authenticate, (req, res) => authController.me(req, res));
router.post('/change-password', authenticate, (req, res) => authController.changePassword(req, res));

export default router;
