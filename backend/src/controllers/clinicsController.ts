import { Request, Response } from 'express';
import Clinic from '../models/Clinic';
import { validationResult } from 'express-validator';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tip: string;
  };
}

// GET /api/clinics - Dobij sve klinike sa filtriranjem
export const getClinics = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      tip,
      grad,
      specialnost,
      minRating,
      parking,
      pristupInvalidima,
      sortBy = 'rating.prosjecna',
      sortOrder = 'desc',
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { aktivna: true, verifikovana: true };

    if (tip) {
      filter.tip = tip;
    }

    if (grad) {
      filter.grad = new RegExp(grad as string, 'i');
    }

    if (specialnost) {
      filter.specialnosti = { $in: [specialnost] };
    }

    if (minRating) {
      filter['rating.prosjecna'] = { $gte: parseFloat(minRating as string) };
    }

    if (parking === 'true') {
      filter.parking = true;
    }

    if (pristupInvalidima === 'true') {
      filter.pristupInvalidima = true;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const clinics = await Clinic.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Clinic.countDocuments(filter);

    res.json({
      success: true,
      data: {
        clinics,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalClinics: total,
          clinicsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju klinika',
      error: error.message
    });
  }
};

// GET /api/clinics/:id - Dobij pojedinačnu kliniku
export const getClinicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findById(id);

    if (!clinic) {
      res.status(404).json({
        success: false,
        message: 'Klinika nije pronađena'
      });
      return;
    }

    res.json({
      success: true,
      data: clinic
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju klinike',
      error: error.message
    });
  }
};

// POST /api/clinics - Kreiranje nove klinike (admin)
export const createClinic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validacijska greška',
        errors: errors.array()
      });
      return;
    }

    const clinicData = req.body;
    
    const clinic = new Clinic({
      ...clinicData,
      verifikovana: true, // Admin kreira verificirane klinike
      aktivna: true
    });

    await clinic.save();

    res.status(201).json({
      success: true,
      message: 'Klinika uspješno kreirana',
      data: clinic
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju klinike',
      error: error.message
    });
  }
};

// PUT /api/clinics/:id - Ažuriranje klinike
export const updateClinic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const clinic = await Clinic.findById(id);
    if (!clinic) {
      res.status(404).json({
        success: false,
        message: 'Klinika nije pronađena'
      });
      return;
    }

    Object.assign(clinic, updates);
    await clinic.save();

    res.json({
      success: true,
      message: 'Klinika uspješno ažurirana',
      data: clinic
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju klinike',
      error: error.message
    });
  }
};

// DELETE /api/clinics/:id - Deaktivacija klinike (admin)
export const deleteClinic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findById(id);
    if (!clinic) {
      res.status(404).json({
        success: false,
        message: 'Klinika nije pronađena'
      });
      return;
    }

    // Samo deaktiviraj umjesto brisanja
    clinic.aktivna = false;
    await clinic.save();

    res.json({
      success: true,
      message: 'Klinika uspješno deaktivirana'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju klinike',
      error: error.message
    });
  }
};

// GET /api/clinics/:id/doctors - Dobij doktore određene klinike
export const getClinicDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findById(id);
    if (!clinic) {
      res.status(404).json({
        success: false,
        message: 'Klinika nije pronađena'
      });
      return;
    }

    // Ovo ćemo implementirati kada dodamo vezu između Doctor i Clinic modela
    // Za sada vraćamo prazan array
    res.json({
      success: true,
      data: {
        doctors: [],
        clinic: clinic.naziv
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju doktora klinike',
      error: error.message
    });
  }
};


