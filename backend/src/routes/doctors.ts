import { Router } from 'express';
import { 
  getDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../controllers/doctorsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { createDoctorValidation, updateDoctorValidation } from '../validators/doctorValidator';

const router = Router();

// GET /api/doctors - Dobij sve doktore (javno dostupno)
router.get('/', getDoctors);

// GET /api/doctors/:id - Dobij pojedinačnog doktora (javno dostupno)
router.get('/:id', getDoctorById);

// POST /api/doctors - Kreiraj novog doktora (samo admin)
router.post('/', authenticateToken, requireAdmin, createDoctorValidation, createDoctor);

// PUT /api/doctors/:id - Ažuriraj doktora (admin ili sam doktor)
router.put('/:id', authenticateToken, updateDoctorValidation, updateDoctor);

// DELETE /api/doctors/:id - Deaktiviraj doktora (samo admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteDoctor);

export default router;
