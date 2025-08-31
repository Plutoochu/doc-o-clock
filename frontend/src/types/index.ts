export interface User {
  _id: string;
  id?: string; // Added for compatibility
  ime: string;
  prezime?: string;
  email: string;
  datumRodjenja: string;
  spol?: 'muški' | 'ženski' | 'ostalo';
  tip: 'admin' | 'patient' | 'doctor' | 'clinic_admin';
  slika?: string;
  aktivan: boolean;
  poslednjaPrijava?: string;
  // Medicinska polja
  telefon?: string;
  adresa?: string;
  grad?: string;
  jmbg?: string;
  zdravstveniKarton?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  naslov: string;
  tekst: string;
  autor: User;
  tip: 'campaign' | 'adventure' | 'tavern-tale' | 'quest' | 'discussion' | 'announcement';
  kategorije: Category[];
  tagovi: Tag[];
  level?: {
    min: number;
    max: number;
  };
  igraci?: {
    min: number;
    max: number;
  };
  lokacija?: string;
  status?: 'planning' | 'active' | 'completed' | 'on-hold';
  javno: boolean;
  zakljucaniKomentari: boolean;
  prikvacen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  tekst: string;
  autor: User;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  naziv: string;
  opis?: string;
  boja: string;
  ikona?: string;
  aktivna: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  naziv: string;
  opis?: string;
  boja: string;
  aktivna: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  ime: string;
  prezime: string;
  email: string;
  password: string;
  confirmPassword: string;
  datumRodjenja: Date;
  spol: 'muški' | 'ženski' | 'ostalo' | null;
}

export interface UpdateUserData {
  ime?: string;
  prezime?: string;
  email?: string;
  datumRodjenja?: Date;
  spol?: 'muški' | 'ženski' | 'ostalo';
  tip?: 'admin' | 'user';
}

export interface CreateUserData extends RegisterData {
  tip: 'admin' | 'user';
}

export interface CreatePostData {
  naslov: string;
  tekst: string;
  tip: 'campaign' | 'adventure' | 'tavern-tale' | 'quest' | 'discussion' | 'announcement';
  kategorije: string[];
  tagovi: string[];
  level?: {
    min: number;
    max: number;
  };
  igraci?: {
    min: number;
    max: number;
  };
  lokacija?: string;
  status?: 'planning' | 'active' | 'completed' | 'on-hold';
  javno: boolean;
  zakljucaniKomentari: boolean;
  prikvacen: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      usersPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    stats: {
      ukupno: number;
      aktivni: number;
      admini: number;
      obicniKorisnici: number;
    };
  };
}

export interface UserFilters {
  search?: string;
  tip?: 'admin' | 'user' | '';
  aktivan?: boolean | '';
  sortBy?: 'ime' | 'email' | 'createdAt' | 'poslednjaPrijava';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkAction {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'makeAdmin' | 'makeUser';
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalComments: number;
      commentsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface Character {
  _id: string;
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
  vlasnik: User;
  javno: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterData {
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
  backstory: string;
  javno: boolean;
}

export interface CharactersResponse {
  success: boolean;
  data: {
    characters: Character[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCharacters: number;
      charactersPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Medicinski tipovi
export interface Doctor {
  _id: string;
  user: User;
  specialnosti: string[];
  bolnica: string;
  opis?: string;
  iskustvo: number;
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
    datum: string;
    termini: string[];
  }[];
  verifikovan: boolean;
  aktivan: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  korisnik: User;
  doktor: Doctor;
  datum: string;
  vrijeme: string;
  specialnost: string;
  razlog?: string;
  napomene?: string;
  status: 'zakazano' | 'potvrdeno' | 'zavrseno' | 'otkazano' | 'propusteno';
  cijena: number;
  trajanje: number;
  online: boolean;
  linkZaOnline?: string;
  tipPlacanja: 'gotovina' | 'kartica' | 'osiguranje';
  placeno: boolean;
  podsjetnik: {
    poslan: boolean;
    datumSlanja?: string;
  };
  ocjena?: {
    vrijednost: number;
    komentar?: string;
    datum: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Clinic {
  _id: string;
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
    telefon?: string; // Added for compatibility
  };
  lokacija: {
    latitude: number;
    longitude: number;
    lat?: number; // Added for compatibility
    lng?: number; // Added for compatibility
  };
  parking: boolean;
  pristupInvalidima: boolean;
  rating: {
    prosjecna: number;
    brojOcjena: number;
  };
  verifikovana: boolean;
  aktivna: boolean;
  createdAt: string;
  updatedAt: string;
}

// Search i Filter tipovi
export interface DoctorFilters {
  search?: string;
  specialnost?: string;
  grad?: string;
  spol?: 'muški' | 'ženski';
  jezik?: string;
  rating?: number;
  minCijena?: number;
  maxCijena?: number;
  dostupanDanas?: boolean;
  online?: boolean;
  sortBy?: 'rating' | 'cijena' | 'iskustvo' | 'ime';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAppointmentData {
  doktor: string;
  datum: string;
  vrijeme: string;
  specialnost: string;
  razlog?: string;
  online: boolean;
  tipPlacanja: 'gotovina' | 'kartica' | 'osiguranje';
}

export interface AppointmentsResponse {
  success: boolean;
  data: {
    appointments: Appointment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalAppointments: number;
      appointmentsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface DoctorsResponse {
  success: boolean;
  data: {
    doctors: Doctor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalDoctors: number;
      doctorsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
} 