import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Crown, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Character } from '../types';
import { useAuth } from '../context/AuthContext';

const CharacterDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, isAdmin } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  const races = {
    'human': 'Human',
    'elf': 'Elf',
    'dwarf': 'Dwarf',
    'halfling': 'Halfling',
    'dragonborn': 'Dragonborn',
    'gnome': 'Gnome',
    'half-elf': 'Half-Elf',
    'half-orc': 'Half-Orc',
    'tiefling': 'Tiefling'
  };

  const classes = {
    'barbarian': 'Barbarian',
    'bard': 'Bard',
    'cleric': 'Cleric',
    'druid': 'Druid',
    'fighter': 'Fighter',
    'monk': 'Monk',
    'paladin': 'Paladin',
    'ranger': 'Ranger',
    'rogue': 'Rogue',
    'sorcerer': 'Sorcerer',
    'warlock': 'Warlock',
    'wizard': 'Wizard'
  };

  const backgrounds = {
    'acolyte': 'Acolyte',
    'criminal': 'Criminal',
    'folk-hero': 'Folk Hero',
    'noble': 'Noble',
    'sage': 'Sage',
    'soldier': 'Soldier',
    'hermit': 'Hermit',
    'entertainer': 'Entertainer',
    'guild-artisan': 'Guild Artisan',
    'outlander': 'Outlander'
  };

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/characters/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCharacter(data.data);
      } else {
        toast.error(data.message || 'Karakter nije pronađen');
        navigate('/characters');
      }
    } catch (error) {
      toast.error('Greška pri dohvatanju karaktera');
      navigate('/characters');
    } finally {
      setLoading(false);
    }
  };

  const deleteCharacter = async () => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj karakter?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/characters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Karakter uspješno obrisan');
        navigate('/characters');
      } else {
        toast.error(data.message || 'Greška pri brisanju karaktera');
      }
    } catch (error) {
      toast.error('Greška pri brisanju karaktera');
    }
  };

  const getModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const canEdit = character && (isAdmin || character.vlasnik._id === user?._id);
  const isCaster = character && ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'].includes(character.klasa);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Karakter nije pronađen</h3>
          <Link
            to="/characters"
            className="text-purple-600 hover:text-purple-700"
          >
            Nazad na karaktere
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/characters')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad na karaktere
          </button>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{character.ime}</h1>
                <div className="flex items-center gap-2">
                  {character.javno ? (
                    <div title="Javno vidljiv">
                      <Eye className="h-5 w-5 text-green-500" />
                    </div>
                  ) : (
                    <div title="Privatan">
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  {character.vlasnik._id === user?._id && (
                    <div title="Vaš karakter">
                      <Crown className="h-5 w-5 text-yellow-500" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-2">
                Level {character.level} {races[character.rasa]} {classes[character.klasa]}
              </p>
              <p className="text-gray-500">
                Background: {backgrounds[character.background]}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Kreirao: {character.vlasnik.ime} {character.vlasnik.prezime}</span>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/characters/${character._id}/edit`}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Uredi
                </Link>
                <button
                  onClick={deleteCharacter}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Obriši
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ability Scores</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(character.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 uppercase mb-1">{stat}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                    <div className="text-sm text-gray-600">{getModifier(value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {character.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {character.skills.map(skill => (
                    <div key={skill} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {character.proficiencies.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Proficiencies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {character.proficiencies.map((prof, index) => (
                    <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">
                      {prof}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {character.equipment.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment</h2>
                <div className="space-y-3">
                  {character.equipment.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.naziv}</div>
                        {item.opis && (
                          <div className="text-sm text-gray-600">{item.opis}</div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-700 ml-4">
                        x{item.kolicina}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isCaster && character.spellSlots && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Spell Slots</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(character.spellSlots).map(([level, slots]) => (
                    slots > 0 && (
                      <div key={level} className="text-center bg-indigo-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-indigo-700 mb-1">
                          Level {level.replace('level', '')}
                        </div>
                        <div className="text-2xl font-bold text-indigo-900">{slots}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {character.backstory && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Backstory</h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {character.backstory}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Character Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rasa:</span>
                  <span className="font-medium">{races[character.rasa]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Klasa:</span>
                  <span className="font-medium">{classes[character.klasa]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Background:</span>
                  <span className="font-medium">{backgrounds[character.background]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{character.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vidljivost:</span>
                  <span className="font-medium">
                    {character.javno ? 'Javno' : 'Privatno'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kreiran:</span>
                  <span className="font-medium">
                    {new Date(character.createdAt).toLocaleDateString('bs-BA')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailsPage; 