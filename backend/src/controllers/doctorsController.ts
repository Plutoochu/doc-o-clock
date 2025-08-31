import { Request, Response } from 'express';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { validationResult } from 'express-validator';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tip: string;
  };
}

// GET /api/doctors - Dobij sve doktore sa filtriranjem
export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      specialnost,
      grad,
      spol,
      jezik,
      minRating,
      maxCijena,
      sortBy = 'rating.prosjecna',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { aktivan: true, verifikovan: true };

    if (specialnost) {
      filter.specialnosti = { $in: [specialnost] };
    }

    if (jezik) {
      filter.jezici = { $in: [jezik] };
    }

    if (minRating) {
      filter['rating.prosjecna'] = { $gte: parseFloat(minRating as string) };
    }

    if (maxCijena) {
      filter.cijenaKonsultacije = { $lte: parseFloat(maxCijena as string) };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const doctors = await Doctor.find(filter)
      .populate({
        path: 'user',
        match: grad ? { grad: new RegExp(grad as string, 'i') } : {},
        select: 'ime prezime email spol grad telefon slika'
      })
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Filter out doctors whose user doesn't match the grad filter
    const filteredDoctors = doctors.filter(doctor => doctor.user);

    const total = await Doctor.countDocuments(filter);

    res.json({
      success: true,
      data: {
        doctors: filteredDoctors,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalDoctors: total,
          doctorsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju doktora',
      error: error.message
    });
  }
};

// GET /api/doctors/:id - Dobij pojedinačnog doktora
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .populate('user', 'ime prezime email spol grad telefon slika');

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doktor nije pronađen'
      });
      return;
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju doktora',
      error: error.message
    });
  }
};

// POST /api/doctors - Kreiranje novog doktora (samo admin)
export const createDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const {
      // User podaci
      ime,
      prezime,
      email,
      password,
      datumRodjenja,
      spol,
      telefon,
      adresa,
      grad,
      // Doctor podaci
      specialnosti,
      bolnica,
      opis,
      iskustvo,
      obrazovanje,
      certifikati,
      jezici,
      cijenaKonsultacije,
      radnoVrijeme
    } = req.body;

    // Provjeri da li već postoji korisnik sa tim email-om
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Korisnik sa ovom email adresom već postoji'
      });
      return;
    }

    // Kreiraj korisnika
    const user = new User({
      ime,
      prezime,
      email,
      password,
      datumRodjenja,
      spol,
      telefon,
      adresa,
      grad,
      tip: 'doctor'
    });

    await user.save();

    // Kreiraj doktora
    const doctor = new Doctor({
      user: user._id,
      specialnosti,
      bolnica,
      opis,
      iskustvo,
      obrazovanje: obrazovanje || [],
      certifikati: certifikati || [],
      jezici: jezici || ['Bosanski'],
      cijenaKonsultacije,
      radnoVrijeme: radnoVrijeme || {},
      dostupnost: [],
      verifikovan: true, // Admin kreira verifikovane doktore
      aktivan: true
    });

    await doctor.save();

    // Popuni user podatke za response
    await doctor.populate('user', 'ime prezime email spol grad telefon');

    res.status(201).json({
      success: true,
      message: 'Doktor uspješno kreiran',
      data: doctor
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju doktora',
      error: error.message
    });
  }
};

// PUT /api/doctors/:id - Ažuriranje doktora (admin ili sam doktor)
export const updateDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doktor nije pronađen'
      });
      return;
    }

    Object.assign(doctor, updates);
    await doctor.save();

    await doctor.populate('user', 'ime prezime email spol grad telefon');

    res.json({
      success: true,
      message: 'Doktor uspješno ažuriran',
      data: doctor
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju doktora',
      error: error.message
    });
  }
};

// DELETE /api/doctors/:id - Brisanje doktora (samo admin)
export const deleteDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doktor nije pronađen'
      });
      return;
    }

    // Samo deaktiviraj umjesto brisanja
    doctor.aktivan = false;
    await doctor.save();

    res.json({
      success: true,
      message: 'Doktor uspješno deaktiviran'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju doktora',
      error: error.message
    });
  }
};


