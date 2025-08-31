import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';
import { IDoctor } from './Doctor';

export interface IAppointment extends Document {
  korisnik: IUser['_id'];
  doktor: IDoctor['_id'];
  datum: Date;
  vrijeme: string; // HH:MM format
  specialnost: string;
  razlog?: string;
  napomene?: string;
  status: 'zakazano' | 'potvrdeno' | 'zavrseno' | 'otkazano' | 'propusteno';
  cijena: number;
  trajanje: number; // u minutama
  online: boolean; // da li je online konsultacija
  linkZaOnline?: string;
  tipPlacanja: 'gotovina' | 'kartica' | 'osiguranje';
  placeno: boolean;
  podsjetnik: {
    poslan: boolean;
    datumSlanja?: Date;
  };
  ocjena?: {
    vrijednost: number; // 1-5
    komentar?: string;
    datum: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  korisnik: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Korisnik je obavezan']
  },
  doktor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doktor je obavezan']
  },
  datum: {
    type: Date,
    required: [true, 'Datum je obavezan'],
    validate: {
      validator: function(datum: Date) {
        return datum > new Date();
      },
      message: 'Datum mora biti u budućnosti'
    }
  },
  vrijeme: {
    type: String,
    required: [true, 'Vrijeme je obavezno'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Vrijeme mora biti u formatu HH:MM']
  },
  specialnost: {
    type: String,
    required: [true, 'Specialnost je obavezna'],
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
  razlog: {
    type: String,
    trim: true,
    maxlength: [500, 'Razlog ne može biti duži od 500 karaktera']
  },
  napomene: {
    type: String,
    trim: true,
    maxlength: [1000, 'Napomene ne mogu biti duže od 1000 karaktera']
  },
  status: {
    type: String,
    required: true,
    enum: ['zakazano', 'potvrdeno', 'zavrseno', 'otkazano', 'propusteno'],
    default: 'zakazano'
  },
  cijena: {
    type: Number,
    required: [true, 'Cijena je obavezna'],
    min: [0, 'Cijena ne može biti negativna']
  },
  trajanje: {
    type: Number,
    required: true,
    default: 30,
    min: [15, 'Minimalno trajanje je 15 minuta'],
    max: [180, 'Maksimalno trajanje je 180 minuta']
  },
  online: {
    type: Boolean,
    default: false,
    required: true
  },
  linkZaOnline: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: IAppointment, link: string) {
        if (this.online && !link) return false;
        return true;
      },
      message: 'Link je obavezan za online konsultacije'
    }
  },
  tipPlacanja: {
    type: String,
    required: true,
    enum: ['gotovina', 'kartica', 'osiguranje'],
    default: 'gotovina'
  },
  placeno: {
    type: Boolean,
    default: false,
    required: true
  },
  podsjetnik: {
    poslan: {
      type: Boolean,
      default: false
    },
    datumSlanja: {
      type: Date
    }
  },
  ocjena: {
    vrijednost: {
      type: Number,
      min: [1, 'Minimalna ocjena je 1'],
      max: [5, 'Maksimalna ocjena je 5']
    },
    komentar: {
      type: String,
      trim: true,
      maxlength: [500, 'Komentar ne može biti duži od 500 karaktera']
    },
    datum: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Compound indeks za sprečavanje duplikata
AppointmentSchema.index({ 
  doktor: 1, 
  datum: 1, 
  vrijeme: 1 
}, { 
  unique: true,
  partialFilterExpression: { 
    status: { $nin: ['otkazano', 'propusteno'] } 
  }
});

// Indeksi za bolju performansu
AppointmentSchema.index({ korisnik: 1, datum: -1 });
AppointmentSchema.index({ doktor: 1, datum: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ datum: 1, status: 1 });

// Pre-save hook za validaciju dostupnosti termina
AppointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('datum') || this.isModified('vrijeme') || this.isModified('doktor')) {
    const postojeciTermin = await model('Appointment').findOne({
      doktor: this.doktor,
      datum: this.datum,
      vrijeme: this.vrijeme,
      status: { $nin: ['otkazano', 'propusteno'] },
      _id: { $ne: this._id }
    });

    if (postojeciTermin) {
      const error = new Error('Termin je već zauzet');
      return next(error);
    }
  }
  next();
});

// Virtuals
AppointmentSchema.virtual('datumVrijeme').get(function() {
  const datum = this.datum;
  const [sati, minute] = this.vrijeme.split(':');
  datum.setHours(parseInt(sati), parseInt(minute), 0, 0);
  return datum;
});

AppointmentSchema.virtual('statusBoja').get(function() {
  const boje = {
    'zakazano': '#fbbf24',     // žuta
    'potvrdeno': '#3b82f6',    // plava  
    'zavrseno': '#10b981',     // zelena
    'otkazano': '#ef4444',     // crvena
    'propusteno': '#6b7280'    // siva
  };
  return boje[this.status] || '#6b7280';
});

AppointmentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default model<IAppointment>('Appointment', AppointmentSchema);
