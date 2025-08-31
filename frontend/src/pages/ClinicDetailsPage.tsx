import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Car, 
  Accessibility,
  Globe,
  Calendar,
  ChevronRight,
  Heart,
  Shield
} from 'lucide-react';
import { Clinic } from '../types';

const ClinicDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock clinic data - samo sarajevske
  const mockClinics: Clinic[] = [
    {
      _id: '1',
      naziv: 'Klinički centar Univerziteta u Sarajevu',
      opis: 'Najveća javna bolnica u BiH sa kompletnim spektrom medicinskih specijalizacija i najmodernijom opremom. Osnovan 1946. godine, KCUS je regionalni centar za tercijalno zdravstvo sa preko 1.400 kreveta i najmodernijom medicinskom opremom.',
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
        'Onkologija centar',
        'Dijagnostička radiologija',
        'Laboratorijske analize',
        'Fizikalna medicina i rehabilitacija'
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
      opis: 'Javna bolnica sa dugom tradicijom i širokim spektrom medicinskih usluga u centru Sarajeva. Osnovana 1934. godine, bolnica nosi ime po dr. Abdulahu Nakasu, čuvenom bosanskom ljekaru i humanisti.',
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
        'Rehabilitacija',
        'Laboratorijske usluge',
        'Radiologija'
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
      opis: 'Moderna privatna poliklinika sa stručnim timom doktora i najnovijim dijagnostičkim uređajima. Osnovana 2010. godine, Avicena je postala sinonim za kvalitetnu privatnu zdravstvenu skrb u Sarajevu.',
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
        'Estetski tretmani',
        'Check-up paketi'
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
    }
  ];

  useEffect(() => {
    const fetchClinic = () => {
      setLoading(true);
      // Simulacija API poziva
      setTimeout(() => {
        const foundClinic = mockClinics.find(c => c._id === id);
        setClinic(foundClinic || null);
        setLoading(false);
      }, 500);
    };

    if (id) {
      fetchClinic();
    }
  }, [id]);

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      ponedjeljak: 'Ponedjeljak',
      utorak: 'Utorak',
      srijeda: 'Srijeda',
      cetvrtak: 'Četvrtak',
      petak: 'Petak',
      subota: 'Subota',
      nedjelja: 'Nedjelja'
    };
    return days[day] || day;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Klinika nije pronađena</h1>
          <Link to="/clinics" className="text-rose-600 hover:text-rose-700">
            ← Nazad na sve klinike
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link 
            to="/clinics" 
            className="text-rose-600 hover:text-rose-700 text-sm font-medium mb-2 inline-block"
          >
            ← Nazad na sve klinike
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{clinic.naziv}</h1>
                {clinic.verifikovana && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <Shield className="h-3 w-3" />
                    Verifikovana
                  </span>
                )}
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-rose-100 text-rose-800 font-medium">
                {clinic.tip}
              </span>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-gray-900">
                  {clinic.rating.prosjecna.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {clinic.rating.brojOcjena} ocjena
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Opis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">O instituciji</h2>
              <p className="text-gray-700 leading-relaxed">{clinic.opis}</p>
            </div>

            {/* Specijalizacije */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specijalizacije</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {clinic.specialnosti.map((spec, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-rose-50 rounded-lg"
                  >
                    <Heart className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-medium text-gray-900">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usluge */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Usluge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clinic.usluge.map((usluga, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2"
                  >
                    <ChevronRight className="h-4 w-4 text-rose-600" />
                    <span className="text-gray-700">{usluga}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radno vrijeme */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Radno vrijeme</h2>
              <div className="space-y-3">
                {Object.entries(clinic.radnoVrijeme).map(([dan, vrijeme]) => (
                  <div key={dan} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-900">{getDayName(dan)}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">
                        {vrijeme.pocetak === '00:00' && vrijeme.kraj === '23:59' 
                          ? '24 sata' 
                          : `${vrijeme.pocetak} - ${vrijeme.kraj}`
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Kontakt informacije */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kontakt</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Adresa</p>
                    <p className="text-gray-700">{clinic.adresa}</p>
                    <p className="text-gray-700">{clinic.grad}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <a 
                      href={`tel:${clinic.telefon}`}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      {clinic.telefon}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a 
                      href={`mailto:${clinic.email}`}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      {clinic.email}
                    </a>
                  </div>
                </div>
                
                {clinic.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a 
                        href={clinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:text-rose-700"
                      >
                        Posjeti stranicu
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dodatne informacije */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dodatne informacije</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Parking</span>
                  </div>
                  <span className={`text-sm font-medium ${clinic.parking ? 'text-green-600' : 'text-red-600'}`}>
                    {clinic.parking ? 'Dostupan' : 'Nije dostupan'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Accessibility className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Pristup invalidima</span>
                  </div>
                  <span className={`text-sm font-medium ${clinic.pristupInvalidima ? 'text-green-600' : 'text-red-600'}`}>
                    {clinic.pristupInvalidima ? 'Omogućen' : 'Nije omogućen'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-rose-50 rounded-lg border border-rose-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Zakažite termin</h3>
              <p className="text-gray-700 mb-4">Kontaktirajte kliniku direktno za zakazivanje termina.</p>
              
              <div className="space-y-2">
                <a
                  href={`tel:${clinic.telefon}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Pozovi sada
                </a>
                
                <Link
                  to="/search"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Pretraži doktore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsPage;
