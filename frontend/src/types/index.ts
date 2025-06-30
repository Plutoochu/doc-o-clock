export interface User {
  _id: string;
  ime: string;
  prezime?: string;
  email: string;
  datumRodjenja: string;
  spol?: 'muški' | 'ženski' | 'ostalo';
  tip: 'admin' | 'user';
  slika?: string;
  aktivan: boolean;
  poslednjaPrijava?: string;
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
  spol: 'muški' | 'ženski' | 'ostalo';
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