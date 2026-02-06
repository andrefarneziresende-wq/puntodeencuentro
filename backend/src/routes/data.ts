/**
 * Data Routes
 * 
 * Routes for Groups, Members, Ministries, Withdrawals, and Dashboard Stats.
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../database/index.js';
import { authenticate } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard Stats
router.get('/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const dbPath = path.resolve('./data/database.json');
    const content = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(content);
    res.json({ stats: data.dashboardStats || {} });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas.' });
  }
});

// Groups
router.get('/groups', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const groups = await db.findAllGroups();
    res.json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Error al obtener los grupos.' });
  }
});

router.get('/groups/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const group = await db.findGroupById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Grupo no encontrado.' });
    }
    
    res.json({ group });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Error al obtener el grupo.' });
  }
});

// Members
router.get('/members', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const members = await db.findAllMembers();
    res.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Error al obtener los integrantes.' });
  }
});

// Integrantes (new format)
router.get('/integrantes', async (req: Request, res: Response) => {
  try {
    const dbPath = path.resolve('./data/database.json');
    const content = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(content);
    res.json({ integrantes: data.integrantes || [] });
  } catch (error) {
    console.error('Error fetching integrantes:', error);
    res.status(500).json({ error: 'Error al obtener los integrantes.' });
  }
});

router.get('/members/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const member = await db.findMemberById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Integrante no encontrado.' });
    }
    
    res.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Error al obtener el integrante.' });
  }
});

// Ministries
router.get('/ministries', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const ministries = await db.findAllMinistries();
    res.json({ ministries });
  } catch (error) {
    console.error('Error fetching ministries:', error);
    res.status(500).json({ error: 'Error al obtener los ministerios.' });
  }
});

router.get('/ministries/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const ministry = await db.findMinistryById(req.params.id);
    
    if (!ministry) {
      return res.status(404).json({ error: 'Ministerio no encontrado.' });
    }
    
    res.json({ ministry });
  } catch (error) {
    console.error('Error fetching ministry:', error);
    res.status(500).json({ error: 'Error al obtener el ministerio.' });
  }
});

// Withdrawals
router.get('/withdrawals', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const withdrawals = await db.findAllWithdrawals();
    res.json({ withdrawals });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Error al obtener las bajas.' });
  }
});

router.get('/withdrawals/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const withdrawal = await db.findWithdrawalById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({ error: 'Baja no encontrada.' });
    }
    
    res.json({ withdrawal });
  } catch (error) {
    console.error('Error fetching withdrawal:', error);
    res.status(500).json({ error: 'Error al obtener la baja.' });
  }
});

export default router;
