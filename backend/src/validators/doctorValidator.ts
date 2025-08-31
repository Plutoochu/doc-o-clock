import { body } from 'express-validator';

export const createDoctorValidation = [
  // User podaci
  body('ime')
    .isLength({ min: 2, max: 50 })
    .withMessage('Ime mora imati između 2 i 50 karaktera')
    .matches(/^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/)
    .withMessage('Ime može sadržavati samo slova'),

  body('prezime')
    .isLength({ min: 2, max: 50 })
    .withMessage('Prezime mora imati između 2 i 50 karaktera')
    .matches(/^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/)
    .withMessage('Prezime može sadržavati samo slova'),

  body('email')
    .isEmail()
    .withMessage('Neispravna email adresa')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),

  body('datumRodjenja')
    .isDate()
    .withMessage('Neispravna format datuma')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      if (age < 25 || age > 80) {
        throw new Error('Doktor mora imati između 25 i 80 godina');
      }
      return true;
    }),

  body('spol')
    .optional()
    .isIn(['muški', 'ženski', 'ostalo'])
    .withMessage('Spol mora biti muški, ženski ili ostalo'),

  body('telefon')
    .optional()
    .matches(/^\+387\s\d{2}\s\d{3}\s\d{3}$/)
    .withMessage('Telefon mora biti u formatu +387 XX XXX XXX'),

  body('grad')
    .isLength({ min: 2, max: 50 })
    .withMessage('Grad mora imati između 2 i 50 karaktera'),

  // Doctor podaci
  body('specialnosti')
    .isArray({ min: 1 })
    .withMessage('Morate odabrati najmanje jednu specialnost'),

  body('specialnosti.*')
    .isLength({ min: 2, max: 50 })
    .withMessage('Svaka specialnost mora imati između 2 i 50 karaktera'),

  body('bolnica')
    .isLength({ min: 2, max: 100 })
    .withMessage('Naziv bolnice mora imati između 2 i 100 karaktera'),

  body('opis')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Opis može imati maksimalno 500 karaktera'),

  body('iskustvo')
    .isInt({ min: 0, max: 60 })
    .withMessage('Iskustvo mora biti između 0 i 60 godina'),

  body('obrazovanje')
    .optional()
    .isArray()
    .withMessage('Obrazovanje mora biti niz'),

  body('certifikati')
    .optional()
    .isArray()
    .withMessage('Certifikati moraju biti niz'),

  body('jezici')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Morate odabrati najmanje jedan jezik'),

  body('cijenaKonsultacije')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Cijena konsultacije mora biti između 0 i 1000 KM'),

  body('radnoVrijeme')
    .optional()
    .isObject()
    .withMessage('Radno vrijeme mora biti objekt')
];

export const updateDoctorValidation = [
  body('specialnosti')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Morate odabrati najmanje jednu specialnost'),

  body('bolnica')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Naziv bolnice mora imati između 2 i 100 karaktera'),

  body('opis')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Opis može imati maksimalno 500 karaktera'),

  body('iskustvo')
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage('Iskustvo mora biti između 0 i 60 godina'),

  body('cijenaKonsultacije')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Cijena konsultacije mora biti između 0 i 1000 KM'),

  body('verifikovan')
    .optional()
    .isBoolean()
    .withMessage('Verifikovan mora biti true ili false'),

  body('aktivan')
    .optional()
    .isBoolean()
    .withMessage('Aktivan mora biti true ili false')
];


