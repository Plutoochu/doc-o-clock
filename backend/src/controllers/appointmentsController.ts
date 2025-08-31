import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
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

// GET /api/appointments - Dobij sve termine (filtriranje po korisniku)
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      korisnik,
      doktor,
      sortBy = 'datum',
      sortOrder = 'asc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    // Filter by user role
    if (req.user?.tip === 'patient') {
      filter.korisnik = req.user.id;
    } else if (req.user?.tip === 'doctor') {
      // Preutreba doktor na osnovu user ID-a
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (doctor) {
        filter.doktor = doctor._id;
      }
    }

    if (status) {
      filter.status = status;
    }

    if (korisnik && req.user?.tip === 'admin') {
      filter.korisnik = korisnik;
    }

    if (doktor && req.user?.tip === 'admin') {
      filter.doktor = doktor;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const appointments = await Appointment.find(filter)
      .populate('korisnik', 'ime prezime email telefon')
      .populate({
        path: 'doktor',
        populate: {
          path: 'user',
          select: 'ime prezime email telefon'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalAppointments: total,
          appointmentsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju termina',
      error: error.message
    });
  }
};

// GET /api/appointments/:id - Dobij pojedinačni termin
export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('korisnik', 'ime prezime email telefon')
      .populate({
        path: 'doktor',
        populate: {
          path: 'user',
          select: 'ime prezime email telefon'
        }
      });

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Termin nije pronađen'
      });
      return;
    }

    // Provjeri da li korisnik ima pravo pristupa ovom terminu
    const userCanAccess = 
      req.user?.tip === 'admin' ||
      (appointment.korisnik as any)._id.toString() === req.user?.id ||
      (appointment.doktor as any).user._id.toString() === req.user?.id;

    if (!userCanAccess) {
      res.status(403).json({
        success: false,
        message: 'Nemate pravo pristupa ovom terminu'
      });
      return;
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju termina',
      error: error.message
    });
  }
};

// POST /api/appointments - Kreiranje novog termina
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
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
      doktor,
      datum,
      vrijeme,
      specialnost,
      razlog,
      online = false,
      tipPlacanja = 'gotovina'
    } = req.body;

    // Provjeri da li doktor postoji
    const doctorObj = await Doctor.findById(doktor);
    if (!doctorObj) {
      res.status(404).json({
        success: false,
        message: 'Doktor nije pronađen'
      });
      return;
    }

    // Kreiraj termin
    const appointment = new Appointment({
      korisnik: req.user?.id,
      doktor,
      datum: new Date(datum),
      vrijeme,
      specialnost,
      razlog,
      cijena: doctorObj.cijenaKonsultacije,
      trajanje: 30, // default 30 minuta
      online,
      tipPlacanja,
      placeno: false,
      status: 'zakazano',
      podsjetnik: {
        poslan: false
      }
    });

    await appointment.save();

    // Popuni podatke za response
    await appointment.populate('korisnik', 'ime prezime email telefon');
    await appointment.populate({
      path: 'doktor',
      populate: {
        path: 'user',
        select: 'ime prezime email telefon'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Termin uspješno zakazan',
      data: appointment
    });
  } catch (error: any) {
    if (error.message === 'Termin je već zauzet') {
      res.status(409).json({
        success: false,
        message: 'Termin je već zauzet'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju termina',
      error: error.message
    });
  }
};

// PUT /api/appointments/:id - Ažuriranje termina
export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Termin nije pronađen'
      });
      return;
    }

    // Provjeri prava pristupa
    const userCanEdit = 
      req.user?.tip === 'admin' ||
      (appointment.korisnik as any).toString() === req.user?.id;

    if (!userCanEdit) {
      res.status(403).json({
        success: false,
        message: 'Nemate pravo mijenjanja ovog termina'
      });
      return;
    }

    Object.assign(appointment, updates);
    await appointment.save();

    await appointment.populate('korisnik', 'ime prezime email telefon');
    await appointment.populate({
      path: 'doktor',
      populate: {
        path: 'user',
        select: 'ime prezime email telefon'
      }
    });

    res.json({
      success: true,
      message: 'Termin uspješno ažuriran',
      data: appointment
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju termina',
      error: error.message
    });
  }
};

// PATCH /api/appointments/:id/cancel - Otkazivanje termina
export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Termin nije pronađen'
      });
      return;
    }

    // Provjeri prava pristupa
    const userCanCancel = 
      req.user?.tip === 'admin' ||
      (appointment.korisnik as any).toString() === req.user?.id;

    if (!userCanCancel) {
      res.status(403).json({
        success: false,
        message: 'Nemate pravo otkazivanja ovog termina'
      });
      return;
    }

    appointment.status = 'otkazano';
    await appointment.save();

    res.json({
      success: true,
      message: 'Termin uspješno otkazan'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri otkazivanju termina',
      error: error.message
    });
  }
};

// POST /api/appointments/:id/rate - Ocijeni doktora nakon termina
export const rateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { vrijednost, komentar } = req.body;

    if (!vrijednost || vrijednost < 1 || vrijednost > 5) {
      res.status(400).json({
        success: false,
        message: 'Ocjena mora biti između 1 i 5'
      });
      return;
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Termin nije pronađen'
      });
      return;
    }

    // Samo korisnik može ocijeniti i samo završene termine
    if ((appointment.korisnik as any).toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Nemate pravo ocjenjivanja ovog termina'
      });
      return;
    }

    if (appointment.status !== 'zavrseno') {
      res.status(400).json({
        success: false,
        message: 'Možete ocijeniti samo završene termine'
      });
      return;
    }

    // Dodaj ocjenu
    appointment.ocjena = {
      vrijednost,
      komentar,
      datum: new Date()
    };

    await appointment.save();

    // Ažuriraj doktor rating (ovo bi trebalo biti u službi ili hook-u)
    const doctor = await Doctor.findById(appointment.doktor);
    if (doctor) {
      const allRatedAppointments = await Appointment.find({
        doktor: doctor._id,
        'ocjena.vrijednost': { $exists: true }
      });

      const totalRating = allRatedAppointments.reduce((sum, app) => sum + app.ocjena!.vrijednost, 0);
      const avgRating = totalRating / allRatedAppointments.length;

      doctor.rating.prosjecna = Math.round(avgRating * 10) / 10;
      doctor.rating.brojOcjena = allRatedAppointments.length;
      
      await doctor.save();
    }

    res.json({
      success: true,
      message: 'Termin uspješno ocijenjen'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ocjenjivanju termina',
      error: error.message
    });
  }
};
