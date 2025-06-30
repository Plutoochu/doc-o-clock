import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Dice1, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CreateCharacterData } from '../types';
import { useAuth } from '../context/AuthContext';

const CreateCharacterPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statMethod, setStatMethod] = useState<'pointBuy' | 'rolled'>('pointBuy');

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Ime, rasa, klasa' },
    { number: 2, title: 'Background', description: 'Background i level' },
    { number: 3, title: 'Stats', description: 'Ability scores' },
    { number: 4, title: 'Skills', description: 'Skills i proficiencies' },
    { number: 5, title: 'Equipment', description: 'Oprema i spell slots' },
    { number: 6, title: 'Finalize', description: 'Backstory i završetak' }
  ];

  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.ime.trim() !== '';
      case 2:
        return formData.level >= 1;
      case 3:
        return Object.values(formData.stats).every(stat => stat >= 8);
      case 4:
        return true; 
      case 5:
        return true; 
      case 6:
        return true; 
      default:
        return false;
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const [formData, setFormData] = useState<CreateCharacterData>({
    ime: '',
    rasa: 'human',
    klasa: 'fighter',
    background: 'folk-hero',
    level: 1,
    stats: {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8
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
    { value: 'human', label: 'Human', description: 'Svestran i adaptabilan' },
    { value: 'elf', label: 'Elf', description: 'Graciozan i magičan' },
    { value: 'dwarf', label: 'Dwarf', description: 'Čvrst i izdržljiv' },
    { value: 'halfling', label: 'Halfling', description: 'Mali ali hrabar' },
    { value: 'dragonborn', label: 'Dragonborn', description: 'Potomak zmajeva' },
    { value: 'gnome', label: 'Gnome', description: 'Izumitelj i ekscentrik' },
    { value: 'half-elf', label: 'Half-Elf', description: 'Između dva svijeta' },
    { value: 'half-orc', label: 'Half-Orc', description: 'Snažan i žestok' },
    { value: 'tiefling', label: 'Tiefling', description: 'Demonska krv' }
  ];

  const classes = [
    { value: 'barbarian', label: 'Barbarian', description: 'Primitivni ratnik' },
    { value: 'bard', label: 'Bard', description: 'Mistični performer' },
    { value: 'cleric', label: 'Cleric', description: 'Svešten isceljitelj' },
    { value: 'druid', label: 'Druid', description: 'Čuvar prirode' },
    { value: 'fighter', label: 'Fighter', description: 'Iskusan ratnik' },
    { value: 'monk', label: 'Monk', description: 'Disciplinovan borac' },
    { value: 'paladin', label: 'Paladin', description: 'Sveti ratnik' },
    { value: 'ranger', label: 'Ranger', description: 'Lovac i tragač' },
    { value: 'rogue', label: 'Rogue', description: 'Skriveni ubica' },
    { value: 'sorcerer', label: 'Sorcerer', description: 'Čarobnjak' },
    { value: 'warlock', label: 'Warlock', description: 'Rizični pakt' },
    { value: 'wizard', label: 'Wizard', description: 'Učeni čarobnjak' }
  ];

  const backgrounds = [
    { value: 'acolyte', label: 'Acolyte', description: 'Sluga hrama' },
    { value: 'criminal', label: 'Criminal', description: 'Izgubljen u zločinu' },
    { value: 'folk-hero', label: 'Folk Hero', description: 'Heroj naroda' },
    { value: 'noble', label: 'Noble', description: 'Plemić' },
    { value: 'sage', label: 'Sage', description: 'Učenjak i mudrac' },
    { value: 'soldier', label: 'Soldier', description: 'Veteran ratnik' },
    { value: 'hermit', label: 'Hermit', description: 'Nomad' },
    { value: 'entertainer', label: 'Entertainer', description: 'Zabavljač' },
    { value: 'guild-artisan', label: 'Guild Artisan', description: 'Zanatlija' },
    { value: 'outlander', label: 'Outlander', description: 'Stanovnik divljine' }
  ];

  const allSkills = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception',
    'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
    'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion',
    'Sleight of Hand', 'Stealth', 'Survival'
  ];

  
  const BASE_STAT = 8;
  const MAX_STAT = 15;
  const TOTAL_POINTS = 27;

  
  const skillLimitsByClass: Record<string, number> = {
    barbarian: 2,
    bard: 3,
    cleric: 2,
    druid: 2,
    fighter: 2,
    monk: 2,
    paladin: 2,
    ranger: 3,
    rogue: 4,
    sorcerer: 2,
    warlock: 2,
    wizard: 2
  };

  const getMaxSkills = () => {
    return skillLimitsByClass[formData.klasa] || 2;
  };

  
  const classProficiencies: Record<string, string[]> = {
    barbarian: ['Light armor', 'Medium armor', 'Shields', 'Simple weapons', 'Martial weapons'],
    bard: ['Light armor', 'Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords', 'Three musical instruments'],
    cleric: ['Light armor', 'Medium armor', 'Shields', 'Simple weapons'],
    druid: ['Light armor', 'Medium armor', 'Shields (non-metal)', 'Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears', 'Herbalism kit'],
    fighter: ['All armor', 'Shields', 'Simple weapons', 'Martial weapons'],
    monk: ['Simple weapons', 'Shortswords', 'One artisan tool or musical instrument'],
    paladin: ['All armor', 'Shields', 'Simple weapons', 'Martial weapons'],
    ranger: ['Light armor', 'Medium armor', 'Shields', 'Simple weapons', 'Martial weapons'],
    rogue: ['Light armor', 'Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords', 'Thieves tools'],
    sorcerer: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    warlock: ['Light armor', 'Simple weapons'],
    wizard: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows']
  };

  
  const raceProficiencies: Record<string, string[]> = {
    human: [],
    elf: ['Longswords', 'Shortbows', 'Longbows', 'Perception'],
    dwarf: ['Battleaxes', 'Handaxes', 'Light hammers', 'Warhammers', 'Smith tools', 'Brewer supplies', 'Mason tools'],
    halfling: ['Slings'],
    dragonborn: [],
    gnome: ['Tinker tools'],
    'half-elf': ['Two skills of choice'],
    'half-orc': [],
    tiefling: []
  };

   
  const backgroundProficiencies: Record<string, string[]> = {
    acolyte: ['Insight', 'Religion'],
    criminal: ['Deception', 'Stealth', 'Thieves tools', 'Gaming set'],
    'folk-hero': ['Animal Handling', 'Survival', 'Vehicles (land)', 'Smith tools'],
    noble: ['History', 'Persuasion', 'Gaming set'],
    sage: ['Arcana', 'History'],
    soldier: ['Athletics', 'Intimidation', 'Vehicles (land)', 'Gaming set'],
    hermit: ['Medicine', 'Religion', 'Herbalism kit'],
    entertainer: ['Acrobatics', 'Performance', 'Disguise kit', 'Musical instrument'],
    'guild-artisan': ['Insight', 'Persuasion', 'Artisan tools'],
    outlander: ['Athletics', 'Survival', 'Herbalism kit', 'Musical instrument']
  };

  const getAllProficiencies = () => {
    const classProficienciesList = classProficiencies[formData.klasa] || [];
    const raceProficienciesList = raceProficiencies[formData.rasa] || [];
    const backgroundProficienciesList = backgroundProficiencies[formData.background] || [];
    
    return [...classProficienciesList, ...raceProficienciesList, ...backgroundProficienciesList];
  };

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
    if (statMethod !== 'pointBuy') return; 
    
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

    setStatMethod('rolled');
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
    setStatMethod('pointBuy');
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

  const handleSubmit = async () => {
    if (!formData.ime.trim()) {
      toast.error('Ime karaktera je obavezno');
      return;
    }

    try {
      setLoading(true);
      
      
      const characterData = {
        ...formData,
        proficiencies: getAllProficiencies()
      };

      const response = await fetch('http://localhost:5000/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(characterData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Karakter uspješno kreiran!');
        window.location.href = '/characters';
      } else {
        toast.error(data.message || 'Greška pri kreiranju karaktera');
      }
    } catch (error) {
      toast.error('Greška pri kreiranju karaktera');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Osnovne informacije</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime karaktera *
              </label>
              <input
                type="text"
                value={formData.ime}
                onChange={(e) => setFormData(prev => ({ ...prev, ime: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Unesite ime karaktera..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Rasa</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {races.map(race => (
                  <div
                    key={race.value}
                    onClick={() => setFormData(prev => ({ ...prev, rasa: race.value as any }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.rasa === race.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{race.label}</h3>
                    <p className="text-sm text-gray-600">{race.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Klasa</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map(cls => (
                  <div
                    key={cls.value}
                    onClick={() => {
                      const newMaxSkills = skillLimitsByClass[cls.value] || 2;
                      setFormData(prev => ({
                        ...prev,
                        klasa: cls.value as any,
                        skills: prev.skills.length > newMaxSkills 
                          ? prev.skills.slice(0, newMaxSkills)
                          : prev.skills
                      }));
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.klasa === cls.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{cls.label}</h3>
                    <p className="text-sm text-gray-600">{cls.description}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      {skillLimitsByClass[cls.value] || 2} skill proficiencies
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Background & Level</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Background</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {backgrounds.map(bg => (
                  <div
                    key={bg.value}
                    onClick={() => setFormData(prev => ({ ...prev, background: bg.value as any }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.background === bg.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{bg.label}</h3>
                    <p className="text-sm text-gray-600">{bg.description}</p>
                  </div>
                ))}
              </div>
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ability Scores</h2>
                {statMethod === 'pointBuy' ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Poeni: {getRemainingPoints()}/{TOTAL_POINTS} ostalo
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Stats su rolled sa 4d6 (drop lowest)
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {statMethod === 'pointBuy' ? (
                  <>
                    <button
                      onClick={resetStats}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={rollStats}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Dice1 className="h-4 w-4" />
                      Roll 4d6
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={rollStats}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Dice1 className="h-4 w-4" />
                      Roll Ponovo
                    </button>
                    <button
                      onClick={resetStats}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Prebaci na Point Buy
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(formData.stats).map(([stat, value]) => (
                <div key={stat} className="text-center bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {stat}
                  </label>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {statMethod === 'pointBuy' ? (
                      <>
                        <button
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
                          onClick={() => adjustStat(stat as keyof typeof formData.stats, true)}
                          disabled={!canIncreaseStat(value)}
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center text-3xl font-bold text-purple-700">
                        {value}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Modifier: {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                  </div>
                  {statMethod === 'pointBuy' && (
                    <div className="text-xs text-gray-500 mt-1">
                      Košta: {getStatCost(value)} poena
                    </div>
                  )}
                  {statMethod === 'rolled' && (
                    <div className="text-xs text-green-600 mt-1">
                      Rolled stat
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Proficiencies</h2>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <span className="text-sm text-gray-600">
                  {formData.skills.length}/{getMaxSkills()} odabrano
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allSkills.map(skill => {
                  const isChecked = formData.skills.includes(skill);
                  const isAtLimit = formData.skills.length >= getMaxSkills();
                  const isDisabled = !isChecked && isAtLimit;
                  
                  return (
                    <label 
                      key={skill} 
                      className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (formData.skills.length < getMaxSkills()) {
                              setFormData(prev => ({
                                ...prev,
                                skills: [...prev.skills, skill]
                              }));
                            }
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              skills: prev.skills.filter(s => s !== skill)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  );
                })}
              </div>
              {formData.skills.length >= getMaxSkills() && (
                <p className="text-sm text-orange-600 mt-2">
                  ⚠️ Dostigli ste maksimum skill proficiencies za {classes.find(c => c.value === formData.klasa)?.label} klasu.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Proficiencies (automatski na osnovu build-a)
              </label>
              
              <div className="space-y-4">
                {/* Class Proficiencies */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Class ({classes.find(c => c.value === formData.klasa)?.label}):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(classProficiencies[formData.klasa] || []).map(prof => (
                      <span key={prof} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Race Proficiencies */}
                {raceProficiencies[formData.rasa]?.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      Rasa ({races.find(r => r.value === formData.rasa)?.label}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {raceProficiencies[formData.rasa].map(prof => (
                        <span key={prof} className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm">
                          {prof}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Background Proficiencies */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Background ({backgrounds.find(b => b.value === formData.background)?.label}):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(backgroundProficiencies[formData.background] || []).map(prof => (
                      <span key={prof} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm">
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Ukupno proficiencies:</h4>
                  <p className="text-sm text-gray-600">
                    {getAllProficiencies().length} različitih proficiencies
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Equipment</h2>
              <button
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
                      onClick={() => removeEquipment(index)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {formData.equipment.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nema dodanog equipmenta. Kliknite "Dodaj" da dodate predmete.</p>
                </div>
              )}
            </div>

            {isCaster && (
              <div>
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
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Finishing Touches</h2>
            
            <div>
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/characters')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad na karaktere
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kreiraj novog karaktera</h1>
          <p className="text-gray-600">D&D 5e Character Creator</p>
        </div>

                <div className="mb-8">
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  onClick={() => goToStep(step.number)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all hover:scale-105 ${
                    step.number === currentStep
                      ? 'bg-purple-600 text-white shadow-lg'
                      : isStepCompleted(step.number)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={`Klik da ideš na: ${step.title} - ${step.description}`}
                >
                  {isStepCompleted(step.number) && step.number !== currentStep ? (
                    <div className="text-white">✓</div>
                  ) : (
                    step.number
                  )}
                </div>
                
                {/* Label */}
                <div 
                  onClick={() => goToStep(step.number)}
                  className={`text-sm font-medium cursor-pointer hover:text-purple-600 transition-colors mt-3 text-center ${
                    step.number === currentStep ? 'text-purple-600' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          {renderStep()}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Prethodna
          </button>

          {currentStep === 6 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Kreiraj karakter
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, 6))}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Sljedeća
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCharacterPage; 