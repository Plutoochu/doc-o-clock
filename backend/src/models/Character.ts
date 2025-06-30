import { Schema, model, Document } from 'mongoose';

export interface ICharacter extends Document {
  ime: string;
  rasa: 'human' | 'elf' | 'dwarf' | 'halfling' | 'dragonborn' | 'gnome' | 'half-elf' | 'half-orc' | 'tiefling';
  klasa: 'barbarian' | 'bard' | 'cleric' | 'druid' | 'fighter' | 'monk' | 'paladin' | 'ranger' | 'rogue' | 'sorcerer' | 'warlock' | 'wizard';
  background: 'acolyte' | 'criminal' | 'folk-hero' | 'noble' | 'sage' | 'soldier' | 'hermit' | 'entertainer' | 'guild-artisan' | 'outlander';
  level: number;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  proficiencies: string[];
  equipment: {
    naziv: string;
    kolicina: number;
    opis?: string;
  }[];
  spellSlots?: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
    level6: number;
    level7: number;
    level8: number;
    level9: number;
  };
  slika?: string;
  backstory: string;
  vlasnik: Schema.Types.ObjectId;
  javno: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>({
  ime: {
    type: String,
    required: [true, 'Ime karaktera je obavezno'],
    trim: true,
    maxlength: [50, 'Ime ne može biti duže od 50 karaktera']
  },
  rasa: {
    type: String,
    required: [true, 'Rasa je obavezna'],
    enum: ['human', 'elf', 'dwarf', 'halfling', 'dragonborn', 'gnome', 'half-elf', 'half-orc', 'tiefling']
  },
  klasa: {
    type: String,
    required: [true, 'Klasa je obavezna'],
    enum: ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard']
  },
  background: {
    type: String,
    required: [true, 'Background je obavezan'],
    enum: ['acolyte', 'criminal', 'folk-hero', 'noble', 'sage', 'soldier', 'hermit', 'entertainer', 'guild-artisan', 'outlander']
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
    default: 1
  },
  stats: {
    strength: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 10
    },
    dexterity: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 10
    },
    constitution: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 10
    },
    intelligence: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 10
    },
    wisdom: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 10
    },
    charisma: {
      type: Number,
      required: true,
      min: 3,
      max: 20,
      default: 10
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  proficiencies: [{
    type: String,
    trim: true
  }],
  equipment: [{
    naziv: {
      type: String,
      required: true,
      trim: true
    },
    kolicina: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    opis: {
      type: String,
      trim: true
    }
  }],
  spellSlots: {
    level1: { type: Number, min: 0, default: 0 },
    level2: { type: Number, min: 0, default: 0 },
    level3: { type: Number, min: 0, default: 0 },
    level4: { type: Number, min: 0, default: 0 },
    level5: { type: Number, min: 0, default: 0 },
    level6: { type: Number, min: 0, default: 0 },
    level7: { type: Number, min: 0, default: 0 },
    level8: { type: Number, min: 0, default: 0 },
    level9: { type: Number, min: 0, default: 0 }
  },
  slika: {
    type: String,
    default: null
  },
  backstory: {
    type: String,
    required: false,
    trim: true,
    maxlength: [5000, 'Backstory ne može biti duži od 5000 karaktera'],
    default: ''
  },
  vlasnik: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  javno: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

CharacterSchema.pre(/^find/, function(this: any) {
  this.populate({
    path: 'vlasnik',
    select: 'ime prezime email tip'
  });
});

CharacterSchema.index({ vlasnik: 1 });
CharacterSchema.index({ ime: 'text', backstory: 'text' });
CharacterSchema.index({ rasa: 1 });
CharacterSchema.index({ klasa: 1 });
CharacterSchema.index({ level: 1 });
CharacterSchema.index({ createdAt: -1 });

CharacterSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default model<ICharacter>('Character', CharacterSchema); 