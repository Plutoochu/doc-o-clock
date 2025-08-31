import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Clock, Car, Accessibility, Globe, Mail, ArrowRight } from 'lucide-react';
import { Clinic } from '../types';
import { Link } from 'react-router-dom';

const ClinicsPage = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const gradovi = ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina'];
  const tipovi = ['Bolnica', 'Poliklinika', 'Klinika', 'Dom zdravlja', 'Privatna praksa'];
  const specialnosti = [
    'Kardiologija', 'Dermatologija', 'Ortopedija', 'Stomatologija',
    'Ginekologija', 'Neurologija', 'Oftalmologija', 'Pedijatrija'
  ];

  // Sarajevske bolnice i poliklinike
  const mockClinics: Clinic[] = [
    {
      _id: '1',
      naziv: 'Klinički centar Univerziteta u Sarajevu',
      opis: 'Najveća javna bolnica u BiH sa kompletnim spektrom medicinskih specijalizacija i najmodernijom opremom.',
      adresa: 'Bolnička 25',
      grad: 'Sarajevo',
      telefon: '+387 33 298 000',
      email: 'info@kcus.ba',
      website: 'https://kcus.ba',
      logo: '',
      slike: [],
      tip: 'Bolnica',
      specialnosti: ['Kardiologija', 'Neurologija', 'Ortopedija', 'Ginekologija', 'Pedijatrija', 'Onkologija', 'Transplantacija'],
      usluge: [
        'Hitna medicinska pomoć 24/7',
        'Ambulantno liječenje',
        'Bolničko liječenje',
        'Operativni zahvati',
        'Intenzivna nega',
        'Transplantacija organa',
        'Onkologija centar'
      ],
      radnoVrijeme: {
        ponedjeljak: { pocetak: '00:00', kraj: '23:59' },
        utorak: { pocetak: '00:00', kraj: '23:59' },
        srijeda: { pocetak: '00:00', kraj: '23:59' },
        cetvrtak: { pocetak: '00:00', kraj: '23:59' },
        petak: { pocetak: '00:00', kraj: '23:59' },
        subota: { pocetak: '00:00', kraj: '23:59' },
        nedjelja: { pocetak: '00:00', kraj: '23:59' }
      },
      kontakt: {
        telefon: '+387 33 298 000',
        email: 'info@kcus.ba',
        website: 'https://kcus.ba'
      },
      lokacija: {
        lat: 43.8563,
        lng: 18.4131,
        adresa: 'Bolnička 25, Sarajevo'
      },
      parking: true,
      pristupInvalidima: true,
      rating: {
        prosjecna: 4.3,
        brojOcjena: 1240
      },
      verifikovana: true,
      aktivna: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      _id: '2',
      naziv: 'Dr. Abdulah Nakas General Hospital',
      opis: 'Javna bolnica sa dugom tradicijom i širokim spektrom medicinskih usluga u centru Sarajeva.',
      adresa: 'Kranjčevićeva 12',
      grad: 'Sarajevo',
      telefon: '+387 33 285 100',
      email: 'info@ukcs.ba',
      website: 'https://ukcs.ba',
      logo: '',
      slike: [],
      tip: 'Bolnica',
      specialnosti: ['Kardiologija', 'Ginekologija', 'Ortopedija', 'Neurologija', 'Pedijatrija', 'Oftalmologija'],
      usluge: [
        'Hitna medicinska pomoć',
        'Ambulantno liječenje',
        'Bolničko liječenje',
        'Dijagnostika',
        'Operativni zahvati',
        'Rehabilitacija'
      ],
      radnoVrijeme: {
        ponedjeljak: { pocetak: '07:00', kraj: '19:00' },
        utorak: { pocetak: '07:00', kraj: '19:00' },
        srijeda: { pocetak: '07:00', kraj: '19:00' },
        cetvrtak: { pocetak: '07:00', kraj: '19:00' },
        petak: { pocetak: '07:00', kraj: '19:00' },
        subota: { pocetak: '08:00', kraj: '14:00' }
      },
      kontakt: {
        telefon: '+387 33 285 100',
        email: 'info@ukcs.ba',
        website: 'https://ukcs.ba'
      },
      lokacija: {
        lat: 43.8520,
        lng: 18.4203,
        adresa: 'Kranjčevićeva 12, Sarajevo'
      },
      parking: true,
      pristupInvalidima: true,
      rating: {
        prosjecna: 4.2,
        brojOcjena: 847
      },
      verifikovana: true,
      aktivna: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      _id: '3',
      naziv: 'Poliklinika Avicena',
      opis: 'Moderna privatna poliklinika sa stručnim timom doktora i najnovijim dijagnostičkim uređajima.',
      adresa: 'Zmaja od Bosne bb',
      grad: 'Sarajevo',
      telefon: '+387 33 668 100',
      email: 'info@avicena.ba',
      website: 'https://avicena.ba',
      logo: '',
      slike: [],
      tip: 'Poliklinika',
      specialnosti: ['Kardiologija', 'Dermatologija', 'Oftalmologija', 'Stomatologija', 'Estetska medicina'],
      usluge: [
        'Preventivni pregledi',
        'Specijalistički pregledi',
        'Laboratorijske analize',
        'Ultrazvuk',
        'EKG',
        'Stomatološke usluge',
        'Estetski tretmani'
      ],
      radnoVrijeme: {
        ponedjeljak: { pocetak: '08:00', kraj: '20:00' },
        utorak: { pocetak: '08:00', kraj: '20:00' },
        srijeda: { pocetak: '08:00', kraj: '20:00' },
        cetvrtak: { pocetak: '08:00', kraj: '20:00' },
        petak: { pocetak: '08:00', kraj: '20:00' },
        subota: { pocetak: '09:00', kraj: '15:00' }
      },
      kontakt: {
        telefon: '+387 33 668 100',
        email: 'info@avicena.ba',
        website: 'https://avicena.ba'
      },
      lokacija: {
        lat: 43.8520,
        lng: 18.3856,
        adresa: 'Zmaja od Bosne bb, Sarajevo'
      },
      parking: true,
      pristupInvalidima: true,
      rating: {
        prosjecna: 4.7,
        brojOcjena: 324
      },
      verifikovana: true,
      aktivna: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      _id: '4',
      naziv: 'Dental Clinic Premium',
      opis: 'Ekskluzivna stomatološka klinika sa fokusom na estetsku stomatologiju i implate.',
      adresa: 'Ferhadija 28',
      grad: 'Sarajevo',
      telefon: '+387 33 570 080',
      email: 'info@dentalpremium.ba',
      website: 'https://dentalpremium.ba',
      logo: '',
      slike: [],
      tip: 'Klinika',
      specialnosti: ['Stomatologija', 'Oralna hirurgija', 'Ortodoncija', 'Endodoncija'],
      usluge: [
        'Estetska stomatologija',
        'Implantati',
        'Ortodoncija',
        'Beljenje zuba',
        'Oralna hirurgija',
        'Protetika',
        'Parodontologija'
      ],
      radnoVrijeme: {
        ponedjeljak: { pocetak: '09:00', kraj: '19:00' },
        utorak: { pocetak: '09:00', kraj: '19:00' },
        srijeda: { pocetak: '09:00', kraj: '19:00' },
        cetvrtak: { pocetak: '09:00', kraj: '19:00' },
        petak: { pocetak: '09:00', kraj: '17:00' },
        subota: { pocetak: '10:00', kraj: '14:00' }
      },
      kontakt: {
        telefon: '+387 33 570 080',
        email: 'info@dentalpremium.ba',
        website: 'https://dentalpremium.ba'
      },
      lokacija: {
        lat: 43.8594,
        lng: 18.4203,
        adresa: 'Ferhadija 28, Sarajevo'
      },
      parking: false,
      pristupInvalidima: true,
      rating: {
        prosjecna: 4.9,
        brojOcjena: 156
      },
      verifikovana: true,
      aktivna: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      _id: '5',
      naziv: 'Beauty & Health Spa Ilidža',
      opis: 'Jedinstveni centar koji kombinuje medicinsku skrb sa wellness i beauty tretmanima u mirnom dijelu grada.',
      adresa: 'Ilidžanska bb',
      grad: 'Sarajevo',
      telefon: '+387 33 789 200',
      email: 'info@beautyhealthspa.ba',
      website: 'https://beautyhealthspa.ba',
      logo: '',
      slike: [],
      tip: 'Poliklinika',
      specialnosti: ['Dermatologija', 'Plastična hirurgija', 'Ginekologija', 'Endokrinologija'],
      usluge: [
        'Anti-aging tretmani',
        'Laser tretmani',
        'Mezoterapija',
        'Botoks i fileri',
        'Plastična hirurgija',
        'Wellness paketi',
        'Nutricionismo'
      ],
      radnoVrijeme: {
        ponedjeljak: { pocetak: '09:00', kraj: '21:00' },
        utorak: { pocetak: '09:00', kraj: '21:00' },
        srijeda: { pocetak: '09:00', kraj: '21:00' },
        cetvrtak: { pocetak: '09:00', kraj: '21:00' },
        petak: { pocetak: '09:00', kraj: '21:00' },
        subota: { pocetak: '10:00', kraj: '18:00' },
        nedjelja: { pocetak: '12:00', kraj: '16:00' }
      },
      kontakt: {
        telefon: '+387 33 789 200',
        email: 'info@beautyhealthspa.ba',
        website: 'https://beautyhealthspa.ba'
      },
      lokacija: {
        lat: 43.8210,
        lng: 18.3164,
        adresa: 'Ilidžanska bb, Sarajevo'
      },
      parking: true,
      pristupInvalidima: true,
      rating: {
        prosjecna: 4.6,
        brojOcjena: 89
      },
      verifikovana: true,
      aktivna: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  useEffect(() => {
    // Simulacija API poziva
    setLoading(true);
    setTimeout(() => {
      setClinics(mockClinics);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.opis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || clinic.grad === selectedCity;
    const matchesType = !selectedType || clinic.tip === selectedType;
    const matchesSpecialty = !selectedSpecialty || clinic.specialnosti.includes(selectedSpecialty);
    
    return matchesSearch && matchesCity && matchesType && matchesSpecialty;
  });

  const formatWorkingHours = (workingHours: any) => {
    const today = new Date().toLocaleString('bs-BA', { weekday: 'long' }).toLowerCase();
    const todayHours = workingHours[today];
    
    if (!todayHours) return 'Zatvoreno danas';
    
    return `${todayHours.pocetak} - ${todayHours.kraj}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Medicinske ustanove</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži klinike, bolnice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="">Svi gradovi</option>
              {gradovi.map(grad => (
                <option key={grad} value={grad}>{grad}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="">Sve vrste</option>
              {tipovi.map(tip => (
                <option key={tip} value={tip}>{tip}</option>
              ))}
            </select>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="">Sve specialnosti</option>
              {specialnosti.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {filteredClinics.length} {filteredClinics.length === 1 ? 'rezultat' : 'rezultata'}
          </p>
        </div>

        <div className="space-y-6">
          {filteredClinics.map(clinic => (
            <div key={clinic._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{clinic.naziv}</h2>
                      {clinic.verifikovana && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          ✓ Verifikovana
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{clinic.opis}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {clinic.tip}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{clinic.rating.prosjecna}</span>
                    <span className="text-sm text-gray-500">({clinic.rating.brojOcjena})</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{clinic.adresa}, {clinic.grad}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{clinic.telefon}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Danas: {formatWorkingHours(clinic.radnoVrijeme)}</span>
                  </div>
                  {clinic.website && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <a 
                        href={clinic.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-rose-600 hover:text-rose-700"
                      >
                        Posjeti website
                      </a>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Specialnosti:</h3>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialnosti.slice(0, 4).map(spec => (
                      <span 
                        key={spec}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-rose-100 text-rose-800"
                      >
                        {spec}
                      </span>
                    ))}
                    {clinic.specialnosti.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        +{clinic.specialnosti.length - 4} više
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 mb-4">
                  {clinic.parking && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Car className="h-4 w-4" />
                      <span className="text-xs">Parking</span>
                    </div>
                  )}
                  {clinic.pristupInvalidima && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Accessibility className="h-4 w-4" />
                      <span className="text-xs">Pristup invalidima</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/clinics/${clinic._id}`}
                    className="flex-1 bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Više detalja
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredClinics.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nema rezultata za odabrane filtere</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicsPage;
