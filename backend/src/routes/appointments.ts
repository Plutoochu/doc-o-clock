import { Router } from 'express';
import { 
  getAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  cancelAppointment,
  rateAppointment 
} from '../controllers/appointmentsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Svi appointment routes zahtijevaju autentifikaciju
router.use(authenticateToken);

// GET /api/appointments - Dobij termine (filtriranje po korisniku)
router.get('/', getAppointments);

// GET /api/appointments/:id - Dobij pojedinačni termin
router.get('/:id', getAppointmentById);

// POST /api/appointments - Kreiraj novi termin
router.post('/', createAppointment);

// PUT /api/appointments/:id - Ažuriraj termin
router.put('/:id', updateAppointment);

// PATCH /api/appointments/:id/cancel - Otkaži termin
router.patch('/:id/cancel', cancelAppointment);

// POST /api/appointments/:id/rate - Ocijeni doktora
router.post('/:id/rate', rateAppointment);

export default router;


