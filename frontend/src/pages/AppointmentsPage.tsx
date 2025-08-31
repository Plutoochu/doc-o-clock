import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Star, MessageCircle, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

  // Mock data
  const mockAppointments: Appointment[] = [
    {
      _id: '1',
      korisnik: user!,
      doktor: {
        _id: 'd1',
        user: {
          _id: 'u1',
          ime: 'Alma',
          prezime: 'Ahmetović',
          email: 'alma@example.com',
          telefon: '+387 61 123 456',
          datumRodjenja: '1980-05-15',
          tip: 'doctor',
          spol: 'ženski',
          aktivan: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        specialnosti: ['Ginekologija'],
        bolnica: 'Dr. Abdulah Nakas General Hospital',
        opis: 'Iskusna ginekolog sa 15 godina iskustva.',
        iskustvo: 15,
        obrazovanje: ['Medicinski fakultet Sarajevo'],
        certifikati: ['Board certified in Gynecology'],
        jezici: ['Bosanski', 'Engleski'],
        cijenaKonsultacije: 80,
        rating: { prosjecna: 4.8, brojOcjena: 127 },
        radnoVrijeme: {},
        dostupnost: [],
        verifikovan: true,
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      datum: '2024-12-27',
      vrijeme: '11:00',
      specialnost: 'Ginekologija',
      razlog: 'Rutinska kontrola',
      status: 'potvrdeno',
      cijena: 80,
      trajanje: 30,
      online: false,
      tipPlacanja: 'gotovina',
      placeno: false,
      podsjetnik: { poslan: false },
      createdAt: '2024-12-20',
      updatedAt: '2024-12-20'
    },
    {
      _id: '2',
      korisnik: user!,
      doktor: {
        _id: 'd2',
        user: {
          _id: 'u2',
          ime: 'Marko',
          prezime: 'Petković',
          email: 'marko@example.com',
          telefon: '+387 61 234 567',
          datumRodjenja: '1975-08-22',
          tip: 'doctor',
          spol: 'muški',
          aktivan: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        specialnosti: ['Kardiologija'],
        bolnica: 'Klinički centar Sarajevo',
        opis: 'Specijalist za kardiovaskularne bolesti.',
        iskustvo: 20,
        obrazovanje: ['Medicinski fakultet Sarajevo'],
        certifikati: ['Cardiology Board Certification'],
        jezici: ['Bosanski', 'Engleski'],
        cijenaKonsultacije: 100,
        rating: { prosjecna: 4.9, brojOcjena: 156 },
        radnoVrijeme: {},
        dostupnost: [],
        verifikovan: true,
        aktivan: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      datum: '2024-12-15',
      vrijeme: '14:30',
      specialnost: 'Kardiologija',
      razlog: 'Kontrola pritiska',
      status: 'zavrseno',
      cijena: 100,
      trajanje: 45,
      online: false,
      tipPlacanja: 'kartica',
      placeno: true,
      podsjetnik: { poslan: true },
      ocjena: {
        vrijednost: 5,
        komentar: 'Odličan doktor, vrlo profesionalan pristup.',
        datum: '2024-12-15'
      },
      createdAt: '2024-12-10',
      updatedAt: '2024-12-15'
    }
  ];

  useEffect(() => {
    // Simulacija API poziva
    setLoading(true);
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'zakazano': 'bg-yellow-100 text-yellow-800',
      'potvrdeno': 'bg-blue-100 text-blue-800',
      'zavrseno': 'bg-green-100 text-green-800',
      'otkazano': 'bg-red-100 text-red-800',
      'propusteno': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'potvrdeno': return <Check className="h-4 w-4" />;
      case 'zavrseno': return <Check className="h-4 w-4" />;
      case 'otkazano': return <X className="h-4 w-4" />;
      case 'propusteno': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.datum);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= today && appointment.status !== 'otkazano';
      case 'past':
        return appointmentDate < today || appointment.status === 'zavrseno';
      case 'cancelled':
        return appointment.status === 'otkazano';
      default:
        return true;
    }
  });

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Da li ste sigurni da želite otkazati ovaj termin?')) {
      // API poziv za otkazivanje
      setAppointments(prev => 
        prev.map(app => 
          app._id === appointmentId 
            ? { ...app, status: 'otkazano' as const }
            : app
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bs-BA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-rose-600" />
            Moji termini
          </h1>
          <p className="text-gray-600 mt-1">Pregled svih vaših zakazanih pregleda</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'Svi termini', count: appointments.length },
            { key: 'upcoming', label: 'Nadolazeći', count: appointments.filter(a => new Date(a.datum) >= new Date() && a.status !== 'otkazano').length },
            { key: 'past', label: 'Prošli', count: appointments.filter(a => new Date(a.datum) < new Date() || a.status === 'zavrseno').length },
            { key: 'cancelled', label: 'Otkazani', count: appointments.filter(a => a.status === 'otkazano').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Appointments list */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema termina</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Nemate zakazanih termina.'
                  : `Nemate ${filter === 'upcoming' ? 'nadolazećih' : filter === 'past' ? 'prošlih' : 'otkazanih'} termina.`
                }
              </p>
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <div key={appointment._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {appointment.doktor.user.ime} {appointment.doktor.user.prezime}
                      </h3>
                      <p className="text-gray-600">{appointment.specialnost}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </span>
                  </div>

                  {/* Date and time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(appointment.datum)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.vrijeme} ({appointment.trajanje} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.doktor.bolnica}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.doktor.user.telefon}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  {appointment.razlog && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-600">Razlog: </span>
                      <span className="text-sm text-gray-900">{appointment.razlog}</span>
                    </div>
                  )}

                  {/* Price and payment */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Cijena:</span>
                      <span className="font-semibold text-gray-900">{appointment.cijena} KM</span>
                      <span className="text-sm text-gray-600">Plaćanje:</span>
                      <span className="text-sm text-gray-900 capitalize">{appointment.tipPlacanja}</span>
                    </div>
                    {appointment.placeno ? (
                      <span className="text-green-600 text-sm font-medium">✓ Plaćeno</span>
                    ) : (
                      <span className="text-orange-600 text-sm font-medium">Nije plaćeno</span>
                    )}
                  </div>

                  {/* Rating (for completed appointments) */}
                  {appointment.status === 'zavrseno' && appointment.ocjena && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">Vaša ocjena: {appointment.ocjena.vrijednost}/5</span>
                      </div>
                      {appointment.ocjena.komentar && (
                        <p className="text-sm text-gray-700">"{appointment.ocjena.komentar}"</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {appointment.status === 'zakazano' || appointment.status === 'potvrdeno' ? (
                      <>
                        <Link 
                          to={`/chat/${appointment.doktor.user._id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat sa doktorom
                        </Link>
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Otkaži termin
                        </button>
                      </>
                    ) : appointment.status === 'zavrseno' && !appointment.ocjena ? (
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        <Star className="h-4 w-4" />
                        Ocijeni doktora
                      </button>
                    ) : (
                      <Link 
                        to={`/chat/${appointment.doktor.user._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Kontaktiraj doktora
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
