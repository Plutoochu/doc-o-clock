import { Schema, model, Document } from 'mongoose';

export interface IClinic extends Document {
  naziv: string;
  opis?: string;
  adresa: string;
  grad: string;
  telefon: string;
  email?: string;
  website?: string;
  logo?: string;
  slike: string[];
  tip: 'bolnica' | 'poliklinika' | 'ordinacija' | 'apoteka' | 'laboratorija';
  specialnosti: string[];
  usluge: string[];
  radnoVrijeme: {
    ponedjeljak?: { pocetak: string; kraj: string };
    utorak?: { pocetak: string; kraj: string };
    srijeda?: { pocetak: string; kraj: string };
    cetvrtak?: { pocetak: string; kraj: string };
    petak?: { pocetak: string; kraj: string };
    subota?: { pocetak: string; kraj: string };
    nedjelja?: { pocetak: string; kraj: string };
  };
  kontakt: {
    hitnaSluzba?: string;
    informacije?: string;
    zakazivanje?: string;
  };
  lokacija: {
    latitude: number;
    longitude: number;
  };
  parking: boolean;
  pristupInvalidima: boolean;
  rating: {
    prosjecna: number;
    brojOcjena: number;
  };
  verifikovana: boolean;
  aktivna: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSchema = new Schema<IClinic>({
  naziv: {
    type: String,
    required: [true, 'Naziv klinike je obavezan'],
    trim: true,
    maxlength: [200, 'Naziv ne može biti duži od 200 karaktera'],
    unique: true
  },
  opis: {
    type: String,
    trim: true,
    maxlength: [2000, 'Opis ne može biti duži od 2000 karaktera']
  },
  adresa: {
    type: String,
    required: [true, 'Adresa je obavezna'],
    trim: true,
    maxlength: [300, 'Adresa ne može biti duža od 300 karaktera']
  },
  grad: {
    type: String,
    required: [true, 'Grad je obavezan'],
    trim: true,
    maxlength: [100, 'Grad ne može biti duži od 100 karaktera']
  },
  telefon: {
    type: String,
    required: [true, 'Telefon je obavezan'],
    trim: true,
    maxlength: [20, 'Telefon ne može biti duži od 20 karaktera']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Neispravna email adresa']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.*/, 'Website mora počinjati sa http:// ili https://']
  },
  logo: {
    type: String,
    trim: true
  },
  slike: {
    type: [String],
    default: []
  },
  tip: {
    type: String,
    required: [true, 'Tip ustanove je obavezan'],
    enum: ['bolnica', 'poliklinika', 'ordinacija', 'apoteka', 'laboratorija']
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
      'Anesteziologija',
      'Opšta medicina',
      'Fizikalna medicina',
      'Patologija',
      'Mikrobiologija'
    ]
  },
  usluge: {
    type: [String],
    default: []
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
  kontakt: {
    hitnaSluzba: {
      type: String,
      trim: true,
      maxlength: [20, 'Telefon ne može biti duži od 20 karaktera']
    },
    informacije: {
      type: String,
      trim: true,
      maxlength: [20, 'Telefon ne može biti duži od 20 karaktera']
    },
    zakazivanje: {
      type: String,
      trim: true,
      maxlength: [20, 'Telefon ne može biti duži od 20 karaktera']
    }
  },
  lokacija: {
    latitude: {
      type: Number,
      required: [true, 'Latitude je obavezna'],
      min: [-90, 'Latitude mora biti između -90 i 90'],
      max: [90, 'Latitude mora biti između -90 i 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude je obavezna'],
      min: [-180, 'Longitude mora biti između -180 i 180'],
      max: [180, 'Longitude mora biti između -180 i 180']
    }
  },
  parking: {
    type: Boolean,
    default: false
  },
  pristupInvalidima: {
    type: Boolean,
    default: false
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
  verifikovana: {
    type: Boolean,
    default: false,
    required: true
  },
  aktivna: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true
});

// Indeksi za bolju performansu
ClinicSchema.index({ grad: 1 });
ClinicSchema.index({ tip: 1 });
ClinicSchema.index({ specialnosti: 1 });
ClinicSchema.index({ 'rating.prosjecna': -1 });
ClinicSchema.index({ aktivna: 1, verifikovana: 1 });
ClinicSchema.index({ 'lokacija.latitude': 1, 'lokacija.longitude': 1 });

// Geospatial indeks za pretragu po lokaciji
ClinicSchema.index({ lokacija: '2dsphere' });

// Text search indeks
ClinicSchema.index({
  naziv: 'text',
  opis: 'text',
  adresa: 'text'
});

ClinicSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default model<IClinic>('Clinic', ClinicSchema);


