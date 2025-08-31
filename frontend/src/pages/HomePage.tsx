import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Search, 
  Stethoscope, 
  MapPin, 
  Clock, 
  User, 
  Settings,
  Heart,
  Activity,
  ChevronRight 
} from 'lucide-react';

const HomePage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Admin korisnici idu direktno na admin panel
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-rose-400 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Dobrodošli u Doc O'Clock
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Pronađite i rezervišite termine kod doktora brzo i jednostavno
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              Registrujte se
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Prijava
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Search className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pronađite doktora</h3>
            <p className="text-gray-600">
              Pretražite doktore po specialnosti, lokaciji i dostupnosti
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Calendar className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Rezervišite termin</h3>
            <p className="text-gray-600">
              Zakažite preglede online bez čekanja u redovima
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Stethoscope className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Medicinska skrb</h3>
            <p className="text-gray-600">
              Pristup širokom spektru medicinskih usluga na jednom mjestu
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mock data - trebat će API pozivi kasnije
  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Ahmetović Alma',
      specialty: 'Ginekologija',
      date: 'Friday, 27 December 2024',
      time: '11:00 - 12:00 AM',
      hospital: 'Dr. Abdulah Nakas General Hospital'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">DOC O'CLOCK</h1>
            <div className="w-6 h-6">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Upcoming Appointments Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming appointments</h2>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-rose-100 border border-rose-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{appointment.time}</p>
                      <div className="mt-3 border-t border-rose-200 pt-3">
                        <p className="text-sm font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <p className="text-sm text-gray-600">at {appointment.hospital}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Nemate zakazane termine</p>
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/search"
            className="bg-white border border-gray-200 p-4 rounded-lg text-center hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Book an</h3>
            <h3 className="font-medium text-gray-900">Appointment</h3>
            <p className="text-sm text-gray-600 mt-1">Find a doctor or specialist</p>
          </Link>

          <Link
            to="/find-clinic"
            className="bg-white border border-gray-200 p-4 rounded-lg text-center hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Find a Clinic</h3>
            <p className="text-sm text-gray-600 mt-1">Browse medical</p>
            <p className="text-sm text-gray-600">specialties</p>
          </Link>

          <Link
            to="/medical-history"
            className="bg-white border border-gray-200 p-4 rounded-lg text-center hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Medical</h3>
            <h3 className="font-medium text-gray-900">History</h3>
            <p className="text-sm text-gray-600 mt-1">Track your health conditions</p>
          </Link>

          <Link
            to="/special-offers"
            className="bg-white border border-gray-200 p-4 rounded-lg text-center hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Check Special</h3>
            <h3 className="font-medium text-gray-900">Offers</h3>
            <p className="text-sm text-gray-600 mt-1">Find discounts</p>
          </Link>
        </div>

        {/* Profile Quick Access */}
        {user && (
          <div className="mt-6">
            <Link
              to="/profile"
              className="bg-white border border-gray-200 p-4 rounded-lg flex items-center hover:bg-gray-50 transition-all"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user.ime} {user.prezime}</p>
                <p className="text-sm text-gray-600">Uredite svoj profil</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 