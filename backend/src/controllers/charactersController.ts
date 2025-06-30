import { Request, Response } from 'express';
import Character from '../models/Character';
import { AuthRequest } from '../middleware/auth';

export const createCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const characterData = {
      ...req.body,
      vlasnik: req.user?.id
    };

    const character = new Character(characterData);
    await character.save();
    
    await character.populate('vlasnik', 'ime prezime email');

    res.status(201).json({
      success: true,
      data: character,
      message: 'Karakter uspješno kreiran'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Greška pri kreiranju karaktera'
    });
  }
};

export const getCharacters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (req.query.vlasnik) {
      filter.vlasnik = req.query.vlasnik;
    } else if (!req.user || req.user.tip !== 'admin') {
      filter.$or = [
        { vlasnik: req.user?.id },
        { javno: true }
      ];
    }

    if (req.query.rasa) {
      filter.rasa = req.query.rasa;
    }
    if (req.query.klasa) {
      filter.klasa = req.query.klasa;
    }
    if (req.query.level) {
      filter.level = req.query.level;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const characters = await Character.find(filter)
      .populate('vlasnik', 'ime prezime email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Character.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        characters,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCharacters: total,
          charactersPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Greška pri dohvatanju karaktera'
    });
  }
};

export const getCharacterById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const character = await Character.findById(req.params.id)
      .populate('vlasnik', 'ime prezime email');

    if (!character) {
      res.status(404).json({
        success: false,
        message: 'Karakter nije pronađen'
      });
      return;
    }

    if (
      !character.javno && 
      (character.vlasnik as any)._id.toString() !== req.user?.id?.toString() && 
      req.user?.tip !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za pristup ovom karakteru'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: character
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Greška pri dohvatanju karaktera'
    });
  }
};

export const updateCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      res.status(404).json({
        success: false,
        message: 'Karakter nije pronađen'
      });
      return;
    }

    if (
      character.vlasnik.toString() !== req.user?.id?.toString() && 
      req.user?.tip !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za uređivanje ovog karaktera'
      });
      return;
    }

    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vlasnik', 'ime prezime email');

    res.status(200).json({
      success: true,
      data: updatedCharacter,
      message: 'Karakter uspješno ažuriran'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Greška pri ažuriranju karaktera'
    });
  }
};

export const deleteCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      res.status(404).json({
        success: false,
        message: 'Karakter nije pronađen'
      });
      return;
    }

    if (
      character.vlasnik.toString() !== req.user?.id?.toString() && 
      req.user?.tip !== 'admin'
    ) {
      res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za brisanje ovog karaktera'
      });
      return;
    }

    await Character.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Karakter uspješno obrisan'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Greška pri brisanju karaktera'
    });
  }
};

export const getMyCharacters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { vlasnik: req.user?.id };

    if (req.query.rasa) {
      filter.rasa = req.query.rasa;
    }
    if (req.query.klasa) {
      filter.klasa = req.query.klasa;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const characters = await Character.find(filter)
      .populate('vlasnik', 'ime prezime email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Character.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        characters,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCharacters: total,
          charactersPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Greška pri dohvatanju karaktera'
    });
  }
}; 