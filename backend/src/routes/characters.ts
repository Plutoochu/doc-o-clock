import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  getMyCharacters
} from '../controllers/charactersController';

const router = express.Router();

router.post('/', authenticate, createCharacter);
router.get('/', authenticate, getCharacters);
router.get('/my', authenticate, getMyCharacters);
router.get('/:id', authenticate, getCharacterById);
router.put('/:id', authenticate, updateCharacter);
router.delete('/:id', authenticate, deleteCharacter);

export default router; 