import { Router } from 'express';
import { 
  getClinics, 
  getClinicById, 
  createClinic, 
  updateClinic, 
  deleteClinic,
  getClinicDoctors 
} from '../controllers/clinicsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/clinics - Dobij sve klinike (javno dostupno)
router.get('/', getClinics);

// GET /api/clinics/:id - Dobij pojedinačnu kliniku (javno dostupno)
router.get('/:id', getClinicById);

// GET /api/clinics/:id/doctors - Dobij doktore klinike (javno dostupno)
router.get('/:id/doctors', getClinicDoctors);

// POST /api/clinics - Kreiraj novu kliniku (samo admin)
router.post('/', authenticateToken, requireAdmin, createClinic);

// PUT /api/clinics/:id - Ažuriraj kliniku (samo admin)
router.put('/:id', authenticateToken, requireAdmin, updateClinic);

// DELETE /api/clinics/:id - Deaktiviraj kliniku (samo admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteClinic);

export default router;


