import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, Eye, Edit, Trash2, Crown, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Character, CharactersResponse } from '../types';
import { useAuth } from '../context/AuthContext';

const CharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, token, isAdmin } = useAuth();

  const races = [
    { value: 'human', label: 'Human' },
    { value: 'elf', label: 'Elf' },
    { value: 'dwarf', label: 'Dwarf' },
    { value: 'halfling', label: 'Halfling' },
    { value: 'dragonborn', label: 'Dragonborn' },
    { value: 'gnome', label: 'Gnome' },
    { value: 'half-elf', label: 'Half-Elf' },
    { value: 'half-orc', label: 'Half-Orc' },
    { value: 'tiefling', label: 'Tiefling' }
  ];

  const classes = [
    { value: 'barbarian', label: 'Barbarian' },
    { value: 'bard', label: 'Bard' },
    { value: 'cleric', label: 'Cleric' },
    { value: 'druid', label: 'Druid' },
    { value: 'fighter', label: 'Fighter' },
    { value: 'monk', label: 'Monk' },
    { value: 'paladin', label: 'Paladin' },
    { value: 'ranger', label: 'Ranger' },
    { value: 'rogue', label: 'Rogue' },
    { value: 'sorcerer', label: 'Sorcerer' },
    { value: 'warlock', label: 'Warlock' },
    { value: 'wizard', label: 'Wizard' }
  ];

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedRace) params.append('rasa', selectedRace);
      if (selectedClass) params.append('klasa', selectedClass);

      const response = await fetch(`http://localhost:5000/api/characters?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data: CharactersResponse = await response.json();

      if (data.success) {
        setCharacters(data.data.characters);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        toast.error('Greška pri dohvatanju karaktera');
      }
    } catch (error) {
      toast.error('Greška pri dohvatanju karaktera');
    } finally {
      setLoading(false);
    }
  };

  const deleteCharacter = async (id: string) => {
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
        fetchCharacters();
      } else {
        toast.error(data.message || 'Greška pri brisanju karaktera');
      }
    } catch (error) {
      toast.error('Greška pri brisanju karaktera');
    }
  };

  useEffect(() => {
    if (token) {
      fetchCharacters();
    }
  }, [currentPage, searchTerm, selectedRace, selectedClass, token]);

  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        fetchCharacters();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [token]);

  const getRaceLabel = (race: string) => {
    return races.find(r => r.value === race)?.label || race;
  };

  const getClassLabel = (cls: string) => {
    return classes.find(c => c.value === cls)?.label || cls;
  };

  const canEditCharacter = (character: Character) => {
    return isAdmin || character.vlasnik._id === user?._id;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Karakteri</h1>
          <p className="text-gray-600">Kreiranje i upravljanje D&D 5e karakterima</p>
        </div>
        <Link
          to="/characters/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novi Karakter
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Pretraži karaktere..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Sve rase</option>
            {races.map(race => (
              <option key={race.value} value={race.value}>
                {race.label}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Sve klase</option>
            {classes.map(cls => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRace('');
              setSelectedClass('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Resetuj
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nema karaktera</h3>
          <p className="text-gray-600 mb-6">Kreirajte svoj prvi D&D karakter!</p>
          <Link
            to="/characters/create"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            Kreiraj Karakter
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <div key={character._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{character.ime}</h3>
                      <p className="text-gray-600">
                        Level {character.level} {getRaceLabel(character.rasa)} {getClassLabel(character.klasa)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {character.javno ? (
                        <div title="Javno">
                          <Eye className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <div title="Privatno">
                          <Shield className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      {character.vlasnik._id === user?._id && (
                        <div title="Vaš karakter">
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{character.stats.strength}</div>
                      <div className="text-gray-500">STR</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{character.stats.dexterity}</div>
                      <div className="text-gray-500">DEX</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{character.stats.constitution}</div>
                      <div className="text-gray-500">CON</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p><strong>Background:</strong> {character.background}</p>
                    <p><strong>Vlasnik:</strong> {character.vlasnik.ime} {character.vlasnik.prezime}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Link
                      to={`/characters/${character._id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Prikaži
                    </Link>
                    
                    {canEditCharacter(character) && (
                      <>
                        <Link
                          to={`/characters/${character._id}/edit`}
                          className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Uredi
                        </Link>
                        <button
                          onClick={() => deleteCharacter(character._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prethodna
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Stranica {currentPage} od {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sljedeća
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharactersPage; 