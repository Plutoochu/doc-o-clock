import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Dice1, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Character, CreateCharacterData } from '../types';
import { useAuth } from '../context/AuthContext';

const EditCharacterPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState<CreateCharacterData>({
    ime: '',
    rasa: 'human',
    klasa: 'fighter',
    background: 'folk-hero',
    level: 1,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    skills: [],
    proficiencies: [],
    equipment: [],
    spellSlots: {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      level6: 0,
      level7: 0,
      level8: 0,
      level9: 0
    },
    backstory: '',
    javno: false
  });

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

  const backgrounds = [
    { value: 'acolyte', label: 'Acolyte' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'folk-hero', label: 'Folk Hero' },
    { value: 'noble', label: 'Noble' },
    { value: 'sage', label: 'Sage' },
    { value: 'soldier', label: 'Soldier' },
    { value: 'hermit', label: 'Hermit' },
    { value: 'entertainer', label: 'Entertainer' },
    { value: 'guild-artisan', label: 'Guild Artisan' },
    { value: 'outlander', label: 'Outlander' }
  ];

  const allSkills = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
    'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
    'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
    'Sleight of Hand', 'Stealth', 'Survival'
  ];

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const fetchCharacter = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`http://localhost:5000/api/characters/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const character: Character = data.data;
        
        if (!isAdmin && character.vlasnik._id !== user?._id) {
          toast.error('Nemate dozvolu za uređivanje ovog karaktera');
          navigate('/characters');
          return;
        }

        setFormData({
          ime: character.ime,
          rasa: character.rasa,
          klasa: character.klasa,
          background: character.background,
          level: character.level,
          stats: character.stats,
          skills: character.skills,
          proficiencies: character.proficiencies,
          equipment: character.equipment,
          spellSlots: character.spellSlots || {
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0,
            level5: 0,
            level6: 0,
            level7: 0,
            level8: 0,
            level9: 0
          },
          backstory: character.backstory,
          javno: character.javno
        });
      } else {
        toast.error(data.message || 'Karakter nije pronađen');
        navigate('/characters');
      }
    } catch (error) {
      toast.error('Greška pri dohvatanju karaktera');
      navigate('/characters');
    } finally {
      setFetchLoading(false);
    }
  };

  const BASE_STAT = 8;
  const MAX_STAT = 15;
  const TOTAL_POINTS = 27;

  const getStatCost = (value: number) => {
    if (value <= 13) return value - BASE_STAT;
    if (value === 14) return 7;
    if (value === 15) return 9;
    return 0;
  };

  const getUsedPoints = () => {
    return Object.values(formData.stats).reduce((total, value) => total + getStatCost(value), 0);
  };

  const getRemainingPoints = () => {
    return TOTAL_POINTS - getUsedPoints();
  };

  const canIncreaseStat = (currentValue: number) => {
    if (currentValue >= MAX_STAT) return false;
    const costToIncrease = currentValue >= 13 ? 2 : 1;
    return getRemainingPoints() >= costToIncrease;
  };

  const canDecreaseStat = (currentValue: number) => {
    return currentValue > BASE_STAT;
  };

  const adjustStat = (statName: keyof typeof formData.stats, increase: boolean) => {
    const currentValue = formData.stats[statName];
    
    if (increase && canIncreaseStat(currentValue)) {
      setFormData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: currentValue + 1
        }
      }));
    } else if (!increase && canDecreaseStat(currentValue)) {
      setFormData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: currentValue - 1
        }
      }));
    }
  };

  const rollStats = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    setFormData(prev => ({
      ...prev,
      stats: {
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat()
      }
    }));
  };

  const resetStats = () => {
    setFormData(prev => ({
      ...prev,
      stats: {
        strength: BASE_STAT,
        dexterity: BASE_STAT,
        constitution: BASE_STAT,
        intelligence: BASE_STAT,
        wisdom: BASE_STAT,
        charisma: BASE_STAT
      }
    }));
  };

  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, { naziv: '', kolicina: 1, opis: '' }]
    }));
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const updateEquipment = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const isCaster = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'].includes(formData.klasa);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ime.trim()) {
      toast.error('Ime karaktera je obavezno');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/characters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Karakter uspješno ažuriran!');
        navigate(`/characters/${id}`);
      } else {
        toast.error(data.message || 'Greška pri ažuriranju karaktera');
      }
    } catch (error) {
      toast.error('Greška pri ažuriranju karaktera');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/characters/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad na karakter
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Uredi karakter</h1>
          <p className="text-gray-600">Ažuriraj informacije o vašem D&D karakteru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Osnovne informacije</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ime karaktera *
                </label>
                <input
                  type="text"
                  value={formData.ime}
                  onChange={(e) => setFormData(prev => ({ ...prev, ime: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level (1-20)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rasa</label>
                <select
                  value={formData.rasa}
                  onChange={(e) => setFormData(prev => ({ ...prev, rasa: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {races.map(race => (
                    <option key={race.value} value={race.value}>
                      {race.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Klasa</label>
                <select
                  value={formData.klasa}
                  onChange={(e) => setFormData(prev => ({ ...prev, klasa: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                <select
                  value={formData.background}
                  onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {backgrounds.map(bg => (
                    <option key={bg.value} value={bg.value}>
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ability Scores</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Poeni: {getRemainingPoints()}/{TOTAL_POINTS} ostalo
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetStats}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={rollStats}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Dice1 className="h-4 w-4" />
                  Roll 4d6
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(formData.stats).map(([stat, value]) => (
                <div key={stat} className="text-center bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {stat}
                  </label>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => adjustStat(stat as keyof typeof formData.stats, false)}
                      disabled={!canDecreaseStat(value)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
                    >
                      -
                    </button>
                    <div className="w-16 text-center text-2xl font-bold text-gray-900">
                      {value}
                    </div>
                    <button
                      type="button"
                      onClick={() => adjustStat(stat as keyof typeof formData.stats, true)}
                      disabled={!canIncreaseStat(value)}
                      className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Modifier: {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Košta: {getStatCost(value)} poena
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills & Proficiencies</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Skills</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allSkills.map(skill => (
                  <label key={skill} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            skills: prev.skills.filter(s => s !== skill)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiencies (odvojene zarezom)
              </label>
              <textarea
                value={formData.proficiencies.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  proficiencies: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Equipment</h2>
              <button
                type="button"
                onClick={addEquipment}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Dodaj
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.equipment.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                    <input
                      type="text"
                      placeholder="Naziv predmeta"
                      value={item.naziv}
                      onChange={(e) => updateEquipment(index, 'naziv', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Količina"
                      min="1"
                      value={item.kolicina}
                      onChange={(e) => updateEquipment(index, 'kolicina', parseInt(e.target.value) || 1)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Opis (opcionalno)"
                      value={item.opis || ''}
                      onChange={(e) => updateEquipment(index, 'opis', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeEquipment(index)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isCaster && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spell Slots</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(formData.spellSlots || {}).map(([level, slots]) => (
                    <div key={level} className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level {level.replace('level', '')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={slots}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          spellSlots: {
                            ...prev.spellSlots!,
                            [level]: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Dodatne informacije</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backstory
              </label>
              <textarea
                value={formData.backstory}
                onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={6}
                placeholder="Napišite priču vašeg karaktera..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="javno"
                checked={formData.javno}
                onChange={(e) => setFormData(prev => ({ ...prev, javno: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="javno" className="text-sm text-gray-700">
                Učini karakter javno vidljivim
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/characters/${id}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Sačuvaj promjene
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCharacterPage; 