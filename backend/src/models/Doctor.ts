import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface IDoctor extends Document {
  user: IUser['_id'];
  specialnosti: string[];
  bolnica: string;
  opis?: string;
  iskustvo: number; // godine iskustva
  obrazovanje: string[];
  certifikati: string[];
  jezici: string[];
  cijenaKonsultacije: number;
  rating: {
    prosjecna: number;
    brojOcjena: number;
  };
  radnoVrijeme: {
    ponedjeljak?: { pocetak: string; kraj: string };
    utorak?: { pocetak: string; kraj: string };
    srijeda?: { pocetak: string; kraj: string };
    cetvrtak?: { pocetak: string; kraj: string };
    petak?: { pocetak: string; kraj: string };
    subota?: { pocetak: string; kraj: string };
    nedjelja?: { pocetak: string; kraj: string };
  };
  dostupnost: {
    datum: Date;
    termini: string[]; // ['09:00', '10:00', '11:00']
  }[];
  verifikovan: boolean;
  aktivan: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Korisnik je obavezan'],
    unique: true
  },
  specialnosti: {
    type: [String],
    required: [true, 'Najmanje jedna specialnost je obavezna'],
    enum: [
      'Kardiologija',
      'Dermatologija', 
      'Ortopedija',
      'Stomatologija',
      'Dermatologija',
      'Ginekologija',
      'Neurologija',
      'Oftalmologija',
      'Pedijatrija',
      'Psihijatrija',
      'Radiologija',
      'Urologija',
      'Endokrinologija',
      'Gastroenterologija',
      'Hematologija',
      'Onkologija',
      'Reumatologija',
      'Anesteziologija'
    ]
  },
  bolnica: {
    type: String,
    required: [true, 'Bolnica/klinika je obavezna'],
    trim: true,
    maxlength: [200, 'Naziv bolnice ne može biti duži od 200 karaktera']
  },
  opis: {
    type: String,
    trim: true,
    maxlength: [1000, 'Opis ne može biti duži od 1000 karaktera']
  },
  iskustvo: {
    type: Number,
    required: [true, 'Godine iskustva su obavezne'],
    min: [0, 'Godine iskustva ne mogu biti negativne'],
    max: [60, 'Maksimalno 60 godina iskustva']
  },
  obrazovanje: {
    type: [String],
    default: []
  },
  certifikati: {
    type: [String],
    default: []
  },
  jezici: {
    type: [String],
    required: [true, 'Najmanje jedan jezik je obavezan'],
    enum: ['Bosanski', 'Engleski', 'Njemački', 'Francuski', 'Španski', 'Ruski', 'Turski', 'Arapski'],
    default: ['Bosanski']
  },
  cijenaKonsultacije: {
    type: Number,
    required: [true, 'Cijena konsultacije je obavezna'],
    min: [0, 'Cijena ne može biti negativna']
  },
  rating: {
    prosjecna: {
      type: Number,
      default: 0,
      min: [0, 'Rating ne može biti manji od 0'],
      max: [5, 'Rating ne može biti veći od 5']
    },
    brojOcjena: {
      type: Number,
      default: 0,
      min: [0, 'Broj ocjena ne može biti negativan']
    }
  },
  radnoVrijeme: {
    ponedjeljak: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    },
    utorak: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    },
    srijeda: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    },
    cetvrtak: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    },
    petak: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    },
    subota: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    },
    nedjelja: {
      pocetak: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] },
      kraj: { type: String, match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Neispravno vrijeme'] }
    }
  },
  dostupnost: [{
    datum: {
      type: Date,
      required: true
    },
    termini: {
      type: [String],
      validate: {
        validator: function(termini: string[]) {
          return termini.every(termin => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(termin));
        },
        message: 'Svi termini moraju biti u formatu HH:MM'
      }
    }
  }],
  verifikovan: {
    type: Boolean,
    default: false,
    required: true
  },
  aktivan: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true
});

// Indeksi za bolju performansu
DoctorSchema.index({ specialnosti: 1 });
DoctorSchema.index({ bolnica: 1 });
DoctorSchema.index({ 'rating.prosjecna': -1 });
DoctorSchema.index({ aktivan: 1, verifikovan: 1 });

// Virtuals
DoctorSchema.virtual('punoIme').get(function(this: IDoctor) {
  if (typeof this.user === 'object' && this.user && 'ime' in this.user && 'prezime' in this.user) {
    return `Dr. ${(this.user as any).ime} ${(this.user as any).prezime}`;
  }
  return 'Dr. Unknown';
});

DoctorSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default model<IDoctor>('Doctor', DoctorSchema);
