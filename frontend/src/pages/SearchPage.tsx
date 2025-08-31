import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, Heart, Stethoscope, Calendar, X, ChevronDown, User, Phone } from 'lucide-react';
import { DoctorFilters, Doctor, DoctorsResponse } from '../types';
import { doctorService } from '../services/doctorService';
import FilterPanel from '../components/FilterPanel';

const SearchPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [favoritesDoctors, setFavoritesDoctors] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DoctorFilters>({
    search: '',
    specialnost: '',
    grad: '',
    spol: undefined,
    jezik: '',
    rating: undefined,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const specialnosti = [
    'Kardiologija', 'Dermatologija', 'Ortopedija', 'Stomatologija',
    'Ginekologija', 'Neurologija', 'Oftalmologija', 'Pedijatrija',
    'Psihijatrija', 'Radiologija', 'Urologija', 'Endokrinologija'
  ];

  const gradovi = ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina'];
  const jezici = ['Bosanski', 'Engleski', 'Njemački', 'Francuski'];

  // Sarajevski doktori povezani sa sarajevskim bolnicama
  const mockDoctors: Doctor[] = [
    // Kardiolog - KCUS
    {
      _id: '1',
      user: {
        _id: 'u1',
        ime: 'Emir',
        prezime: 'Hodžić',
        email: 'emir@example.com',
        spol: 'muški',
        grad: 'Sarajevo',
        telefon: '+387 61 123 456',
        datumRodjenja: '1970-03-15',
        tip: 'doctor',
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      specialnosti: ['Kardiologija'],
      bolnica: 'Klinički centar Univerziteta u Sarajevu',
      opis: 'Vodeći kardiolog sa 20+ godina iskustva u invazivnoj kardiologiji i kateterizaciji.',
      iskustvo: 22,
      obrazovanje: ['Medicinski fakultet Sarajevo', 'Specijalizacija kardiologija', 'Usavršavanje u Njemačkoj'],
      certifikati: ['Licenca za kardiologiju', 'Intervencijska kardiologija'],
      jezici: ['Bosanski', 'Engleski', 'Njemački'],
      cijenaKonsultacije: 120,
      rating: { prosjecna: 4.9, brojOcjena: 156 },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '08:00', kraj: '16:00' },
        utorak: { pocetak: '08:00', kraj: '16:00' },
        srijeda: { pocetak: '08:00', kraj: '16:00' },
        cetvrtak: { pocetak: '08:00', kraj: '16:00' },
        petak: { pocetak: '08:00', kraj: '14:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    // Ginekolog - Dr. Abdulah Nakas
    {
      _id: '2',
      user: {
        _id: 'u2',
        ime: 'Alma',
        prezime: 'Ahmetović',
        email: 'alma@example.com',
        spol: 'ženski',
        grad: 'Sarajevo',
        telefon: '+387 65 234 567',
        datumRodjenja: '1980-05-15',
        tip: 'doctor',
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      specialnosti: ['Ginekologija'],
      bolnica: 'Dr. Abdulah Nakas General Hospital',
      opis: 'Iskusna ginekolog sa 15 godina iskustva u reproduktivnoj medicini.',
      iskustvo: 15,
      obrazovanje: ['Medicinski fakultet Sarajevo', 'Specijalizacija ginekologija'],
      certifikati: ['Licenca za ginekologiju'],
      jezici: ['Bosanski', 'Engleski'],
      cijenaKonsultacije: 80,
      rating: { prosjecna: 4.8, brojOcjena: 127 },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '08:00', kraj: '16:00' },
        utorak: { pocetak: '08:00', kraj: '16:00' },
        srijeda: { pocetak: '08:00', kraj: '16:00' },
        cetvrtak: { pocetak: '08:00', kraj: '16:00' },
        petak: { pocetak: '08:00', kraj: '14:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    // Kardiolog - Poliklinika Avicena
    {
      _id: '3',
      user: {
        _id: 'u3',
        ime: 'Amira',
        prezime: 'Selimović',
        email: 'amira@example.com',
        spol: 'ženski',
        grad: 'Sarajevo',
        telefon: '+387 61 345 678',
        datumRodjenja: '1978-12-10',
        tip: 'doctor',
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      specialnosti: ['Kardiologija'],
      bolnica: 'Poliklinika Avicena',
      opis: 'Kardiologa specijalizovana za preventivnu kardiologiju i dijagnostiku.',
      iskustvo: 12,
      obrazovanje: ['Medicinski fakultet Sarajevo', 'Kardiologija specijalizacija'],
      certifikati: ['Preventivna kardiologija', 'Ehokardiografija'],
      jezici: ['Bosanski', 'Engleski', 'Francuski'],
      cijenaKonsultacije: 95,
      rating: { prosjecna: 4.7, brojOcjena: 89 },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '08:00', kraj: '16:00' },
        utorak: { pocetak: '08:00', kraj: '16:00' },
        cetvrtak: { pocetak: '08:00', kraj: '16:00' },
        petak: { pocetak: '08:00', kraj: '14:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    // Stomatolog - Dental Clinic Premium
    {
      _id: '4',
      user: {
        _id: 'u4',
        ime: 'Stefan',
        prezime: 'Nikolić',
        email: 'stefan@example.com',
        spol: 'muški',
        grad: 'Sarajevo',
        telefon: '+387 62 456 789',
        datumRodjenja: '1985-04-18',
        tip: 'doctor',
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      specialnosti: ['Stomatologija'],
      bolnica: 'Dental Clinic Premium',
      opis: 'Moderni stomatolog specijalizovan za estetsku stomatologiju i implate.',
      iskustvo: 10,
      obrazovanje: ['Stomatološki fakultet Sarajevo', 'Implantologija kurs'],
      certifikati: ['Estetska stomatologija', 'Specijalist za implante'],
      jezici: ['Bosanski', 'Engleski', 'Italijanski'],
      cijenaKonsultacije: 75,
      rating: { prosjecna: 4.9, brojOcjena: 156 },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '09:00', kraj: '19:00' },
        utorak: { pocetak: '09:00', kraj: '19:00' },
        srijeda: { pocetak: '09:00', kraj: '19:00' },
        cetvrtak: { pocetak: '09:00', kraj: '19:00' },
        petak: { pocetak: '09:00', kraj: '17:00' },
        subota: { pocetak: '10:00', kraj: '14:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    // Dermatolog - Beauty & Health Spa
    {
      _id: '5',
      user: {
        _id: 'u5',
        ime: 'Lejla',
        prezime: 'Husić',
        email: 'lejla@example.com',
        spol: 'ženski',
        grad: 'Sarajevo',
        telefon: '+387 63 567 890',
        datumRodjenja: '1982-07-25',
        tip: 'doctor',
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      specialnosti: ['Dermatologija'],
      bolnica: 'Beauty & Health Spa Ilidža',
      opis: 'Dermatologinja sa fokusom na estetsku dermatologiju i laser tretmane.',
      iskustvo: 8,
      obrazovanje: ['Medicinski fakultet Sarajevo', 'Dermatologija specijalizacija'],
      certifikati: ['Laser terapija', 'Estetska dermatologija'],
      jezici: ['Bosanski', 'Engleski'],
      cijenaKonsultacije: 90,
      rating: { prosjecna: 4.6, brojOcjena: 78 },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '09:00', kraj: '17:00' },
        utorak: { pocetak: '09:00', kraj: '17:00' },
        srijeda: { pocetak: '09:00', kraj: '17:00' },
        petak: { pocetak: '09:00', kraj: '17:00' },
        subota: { pocetak: '10:00', kraj: '14:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    // Neurolog - KCUS
    {
      _id: '6',
      user: {
        _id: 'u6',
        ime: 'Muhamed',
        prezime: 'Softić',
        email: 'muhamed@example.com',
        spol: 'muški',
        grad: 'Sarajevo',
        telefon: '+387 61 678 901',
        datumRodjenja: '1976-11-12',
        tip: 'doctor',
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      specialnosti: ['Neurologija'],
      bolnica: 'Klinički centar Univerziteta u Sarajevu',
      opis: 'Neurolog sa iskustvom u dijagnostici i liječenju neurodegenerativnih bolesti.',
      iskustvo: 16,
      obrazovanje: ['Medicinski fakultet Sarajevo', 'Neurologija specijalizacija'],
      certifikati: ['EEG specijalist', 'Poremećaji pokreta'],
      jezici: ['Bosanski', 'Engleski'],
      cijenaKonsultacije: 100,
      rating: { prosjecna: 4.7, brojOcjena: 134 },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '08:00', kraj: '15:00' },
        utorak: { pocetak: '08:00', kraj: '15:00' },
        srijeda: { pocetak: '08:00', kraj: '15:00' },
        cetvrtak: { pocetak: '08:00', kraj: '15:00' },
        petak: { pocetak: '08:00', kraj: '13:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  // Initial load
  useEffect(() => {
    setDoctors(mockDoctors);
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        
        // Provjeri da li je backend dostupan
        const response = await doctorService.getDoctors(filters);
        
        if (response.success && response.data?.doctors) {
          setDoctors(response.data.doctors);
        } else {
          console.warn('Backend not available, using mock data');
          setDoctors(mockDoctors);
        }
      } catch (error: any) {
        console.warn('Backend not available, using mock data. Error:', error.message);
        // Uvijek koristi mock data ako backend nije dostupan
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    };

    // Skip first render (empty filters)
    if (filters.search !== '' || filters.specialnost !== '' || filters.grad !== '') {
      fetchDoctors();
    }
  }, [filters]);

  const handleFilterChange = (key: keyof DoctorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (doctorId: string) => {
    setFavoritesDoctors(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(doctorId)) {
        newFavorites.delete(doctorId);
      } else {
        newFavorites.add(doctorId);
      }
      return newFavorites;
    });
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Zakažite termin</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretražite doktore..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                showFilters 
                  ? 'text-rose-600 bg-rose-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>


        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
              specialnosti={specialnosti}
              gradovi={gradovi}
              jezici={jezici}
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-4">
                  {/* Doctor Avatar */}
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-8 w-8 text-rose-600" />
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {doctor.user.ime} {doctor.user.prezime}
                        </h3>
                        <p className="text-sm text-gray-600">{doctor.specialnosti.join(', ')}</p>
                        <p className="text-sm text-gray-500 mt-1">{doctor.bolnica}</p>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{doctor.rating.prosjecna}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <MapPin className="h-3 w-3 mr-1" />
                        {doctor.user.grad}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {doctor.iskustvo} godina iskustva
                      </span>
                      {doctor.jezici.includes('Engleski') && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          Engleski
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-rose-100 text-rose-800">
                        {doctor.cijenaKonsultacije} KM
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link 
                        to={`/book/${doctor._id}`}
                        className="flex-1 bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Zakaži termin
                      </Link>
                      <button 
                        onClick={() => toggleFavorite(doctor._id)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          favoritesDoctors.has(doctor._id)
                            ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${
                          favoritesDoctors.has(doctor._id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {doctors.length === 0 && !loading && (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nema rezultata za odabrane filtere</p>
                <p className="text-sm text-gray-500 mt-2">Pokušajte promijeniti filtere pretraživanja</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
