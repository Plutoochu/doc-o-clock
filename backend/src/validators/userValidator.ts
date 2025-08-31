import { body } from 'express-validator';

export const registerValidation = [
  body('ime')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ime mora imati između 2 i 50 karaktera'),
  body('prezime')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Prezime mora imati između 2 i 50 karaktera'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),
  body('datumRodjenja')
    .isISO8601()
    .toDate()
    .withMessage('Neispravni datum rođenja'),
  body('spol')
    .optional({ checkFalsy: true })
    .isIn(['muški', 'ženski', 'ostalo'])
    .withMessage('Spol mora biti: muški, ženski ili ostalo'),
  body('telefon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Telefon ne može biti duži od 20 karaktera'),
  body('adresa')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Adresa ne može biti duža od 200 karaktera'),
  body('grad')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Grad ne može biti duži od 50 karaktera'),
  // tip se ne validira u javnoj registraciji - uvijek patient
];

export const updateProfileValidation = [
  body('ime')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ime mora imati između 2 i 50 karaktera'),
  body('prezime')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Prezime mora imati između 2 i 50 karaktera'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('datumRodjenja')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Neispravni datum rođenja'),
  body('spol')
    .optional({ checkFalsy: true })
    .isIn(['muški', 'ženski', 'ostalo'])
    .withMessage('Spol mora biti: muški, ženski ili ostalo'),
  body('telefon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Telefon ne može biti duži od 20 karaktera'),
  body('adresa')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Adresa ne može biti duža od 200 karaktera'),
  body('grad')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Grad ne može biti duži od 50 karaktera'),
  body('tip')
    .optional({ checkFalsy: true })
    .isIn(['admin', 'patient', 'doctor', 'clinic_admin'])
    .withMessage('Tip mora biti: admin, patient, doctor ili clinic_admin')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('password')
    .notEmpty()
    .withMessage('Lozinka je obavezna')
]; 