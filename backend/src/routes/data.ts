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

// Get single integrante by ID
router.get('/integrantes/:id', async (req: Request, res: Response) => {
  try {
    const dbPath = path.resolve('./data/database.json');
    const content = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(content);
    const integrante = (data.integrantes || []).find((i: { id: string }) => i.id === req.params.id);
    
    if (!integrante) {
      return res.status(404).json({ error: 'Integrante no encontrado.' });
    }
    
    res.json({ integrante });
  } catch (error) {
    console.error('Error fetching integrante:', error);
    res.status(500).json({ error: 'Error al obtener el integrante.' });
  }
});

// Create new integrante
router.post('/integrantes', async (req: Request, res: Response) => {
  try {
    const dbPath = path.resolve('./data/database.json');
    const content = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(content);
    
    const integrantes = data.integrantes || [];
    
    // Generate new ID
    const maxId = integrantes.reduce((max: number, i: { id: string }) => {
      const num = parseInt(i.id.replace('i', ''), 10);
      return num > max ? num : max;
    }, 0);
    const newId = `i${maxId + 1}`;
    
    // Generate new member number if es miembro
    let newNumero = null;
    if (req.body.esMiembro) {
      const maxNumero = integrantes.reduce((max: number, i: { numero?: number }) => {
        return (i.numero || 0) > max ? i.numero || 0 : max;
      }, 0);
      newNumero = maxNumero + 1;
    }
    
    const newIntegrante = {
      id: newId,
      numero: req.body.esMiembro ? (req.body.numero ? parseInt(req.body.numero, 10) : newNumero) : null,
      nombre: `${req.body.nombre} ${req.body.apellidos}`.trim(),
      foto: req.body.foto || null,
      email: req.body.email || '',
      telefono: req.body.prefijo ? `${req.body.prefijo} ${req.body.telefono}` : req.body.telefono || '',
      edad: null,
      fechaNacimiento: req.body.fechaNacimiento || '',
      direccion: req.body.direccion || '',
      rol: req.body.responsabilidad?.supervisor ? 'supervisor' : 
           req.body.responsabilidad?.responsable ? 'responsable' : 
           req.body.responsabilidad?.ayudante ? 'ayudante' : null,
      grupo: req.body.grupo || null,
      gruposSupervisa: req.body.responsabilidad?.supervisorGrupos || [],
      esMiembro: req.body.esMiembro || false,
      nuevoCreyente: req.body.fe?.nuevoCreyente || false,
      etiquetas: [],
      porcentaje: req.body.grupo ? 0 : null,
      asistencia: { ultimoMes: 0, ultimoAno: 0, desdeSiempre: 0 },
      formacion: {
        discipuladoInicial: req.body.formacion?.discipuladoInicial?.replace('_', ' ') || 'No iniciado',
        preBautismos: req.body.formacion?.preBautismos?.replace('_', ' ') || 'No iniciado',
        escuelaBiblica: req.body.formacion?.escuelaBiblica?.replace('_', ' ') || 'No iniciado',
        escuelaDiscipulado: req.body.formacion?.escuelaDiscipulado?.replace('_', ' ') || 'No iniciado',
        entrenamiento: req.body.formacion?.entrenamiento?.replace('_', ' ') || 'No iniciado'
      },
      bautizado: req.body.fe?.bautizado || false,
      nuevoBautizado: req.body.fe?.nuevoBautizado || false,
      iglesiaProcedente: req.body.fe?.procedenteOtraIglesia ? req.body.fe.nombreIglesiaCiudad : null,
      ministerios: req.body.ministerios || [],
      observaciones: req.body.observaciones || '',
      servicios: []
    };
    
    integrantes.push(newIntegrante);
    data.integrantes = integrantes;
    
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    
    res.status(201).json({ integrante: newIntegrante });
  } catch (error) {
    console.error('Error creating integrante:', error);
    res.status(500).json({ error: 'Error al crear el integrante.' });
  }
});

// Update integrante
router.put('/integrantes/:id', async (req: Request, res: Response) => {
  try {
    const dbPath = path.resolve('./data/database.json');
    const content = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(content);
    
    const integrantes = data.integrantes || [];
    const index = integrantes.findIndex((i: { id: string }) => i.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Integrante no encontrado.' });
    }
    
    const existing = integrantes[index];
    
    const updatedIntegrante = {
      ...existing,
      numero: req.body.esMiembro ? (req.body.numero ? parseInt(req.body.numero, 10) : existing.numero) : null,
      nombre: `${req.body.nombre} ${req.body.apellidos}`.trim(),
      foto: req.body.foto || existing.foto,
      email: req.body.email || existing.email,
      telefono: req.body.prefijo ? `${req.body.prefijo} ${req.body.telefono}` : req.body.telefono || existing.telefono,
      fechaNacimiento: req.body.fechaNacimiento || existing.fechaNacimiento,
      direccion: req.body.direccion || existing.direccion,
      rol: req.body.responsabilidad?.supervisor ? 'supervisor' : 
           req.body.responsabilidad?.responsable ? 'responsable' : 
           req.body.responsabilidad?.ayudante ? 'ayudante' : null,
      grupo: req.body.grupo || null,
      gruposSupervisa: req.body.responsabilidad?.supervisorGrupos || [],
      esMiembro: req.body.esMiembro || false,
      nuevoCreyente: req.body.fe?.nuevoCreyente || false,
      formacion: {
        discipuladoInicial: req.body.formacion?.discipuladoInicial?.replace('_', ' ') || existing.formacion?.discipuladoInicial || 'No iniciado',
        preBautismos: req.body.formacion?.preBautismos?.replace('_', ' ') || existing.formacion?.preBautismos || 'No iniciado',
        escuelaBiblica: req.body.formacion?.escuelaBiblica?.replace('_', ' ') || existing.formacion?.escuelaBiblica || 'No iniciado',
        escuelaDiscipulado: req.body.formacion?.escuelaDiscipulado?.replace('_', ' ') || existing.formacion?.escuelaDiscipulado || 'No iniciado',
        entrenamiento: req.body.formacion?.entrenamiento?.replace('_', ' ') || existing.formacion?.entrenamiento || 'No iniciado'
      },
      bautizado: req.body.fe?.bautizado || false,
      nuevoBautizado: req.body.fe?.nuevoBautizado || false,
      iglesiaProcedente: req.body.fe?.procedenteOtraIglesia ? req.body.fe.nombreIglesiaCiudad : null,
      ministerios: req.body.ministerios || existing.ministerios || [],
      observaciones: req.body.observaciones || existing.observaciones || ''
    };
    
    integrantes[index] = updatedIntegrante;
    data.integrantes = integrantes;
    
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    
    res.json({ integrante: updatedIntegrante });
  } catch (error) {
    console.error('Error updating integrante:', error);
    res.status(500).json({ error: 'Error al actualizar el integrante.' });
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
