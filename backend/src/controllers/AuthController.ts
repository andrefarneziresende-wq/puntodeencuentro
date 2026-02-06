/**
 * Auth Controller
 * 
 * Handles HTTP requests for authentication.
 */

import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos.' });
        return;
      }

      const result = await authService.register(email, password, name);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(201).json({
        message: 'Usuario registrado correctamente.',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Error al registrar usuario.' });
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos.' });
        return;
      }

      const result = await authService.login(email, password);

      if (!result.success) {
        res.status(401).json({ error: result.error });
        return;
      }

      res.json({
        message: 'Inicio de sesión exitoso.',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email es requerido.' });
        return;
      }

      await authService.requestPasswordReset(email);

      // Always return success to prevent email enumeration
      res.json({
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        res.status(400).json({ error: 'Token y contraseña son requeridos.' });
        return;
      }

      const result = await authService.resetPassword(token, password);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'No autenticado.' });
        return;
      }

      const user = await authService.getUserById(req.userId);

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ error: 'Error al obtener usuario.' });
    }
  }

  /**
   * POST /api/auth/change-password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'No autenticado.' });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Contraseña actual y nueva son requeridas.' });
        return;
      }

      const result = await authService.updatePassword(req.userId, currentPassword, newPassword);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Error al cambiar la contraseña.' });
    }
  }
}

// Singleton instance
export const authController = new AuthController();
