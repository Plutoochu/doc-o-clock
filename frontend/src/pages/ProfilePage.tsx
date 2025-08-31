import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Edit, 
  Calendar, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Camera,
  Settings,
  Shield,
  Activity,
  FileText
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // Mock recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'appointment',
      title: 'Termin završen',
      description: 'Dr. Emir Hodžić - Kardiologija',
      date: '2024-12-20',
      icon: Calendar
    },
    {
      id: '2',
      type: 'medical',
      title: 'Medicinska historija ažurirana',
      description: 'Dodana nova alergija',
      date: '2024-12-18',
      icon: Heart
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Termin zakazan',
      description: 'Dr. Stefan Nikolić - Stomatologija',
      date: '2024-12-15',
      icon: Calendar
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'medical':
        return Heart;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'text-blue-600 bg-blue-100';
      case 'medical':
        return 'text-rose-600 bg-rose-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-rose-600" />
            Moj profil
          </h1>
          <p className="text-gray-600 mt-1">Upravljajte svojim računom i podacima</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-rose-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white hover:bg-rose-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  {user.ime} {user.prezime}
                </h2>
                <p className="text-gray-600 text-center capitalize">{user.tip}</p>
                
                {user.tip === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 mt-2">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Link
                  to="/profile/edit"
                  className="w-full flex items-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Uredi profil
                </Link>
                
                <Link
                  to="/medical-history"
                  className="w-full flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Medicinska historija
                </Link>
                
                <Link
                  to="/appointments"
                  className="w-full flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Moji termini
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lični podaci</h3>
                <Link
                  to="/profile/edit"
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                >
                  Uredi
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                {user.telefon && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telefon</p>
                      <p className="text-sm text-gray-900">{user.telefon}</p>
                    </div>
                  </div>
                )}
                
                {user.grad && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Grad</p>
                      <p className="text-sm text-gray-900">{user.grad}</p>
                    </div>
                  </div>
                )}
                
                {user.datumRodjenja && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Datum rođenja</p>
                      <p className="text-sm text-gray-900">
                        {new Date(user.datumRodjenja).toLocaleDateString('bs-BA')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {user.adresa && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Adresa</p>
                      <p className="text-sm text-gray-900">{user.adresa}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nedavna aktivnost</h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString('bs-BA')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to="/activity"
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                >
                  Vidi svu aktivnost →
                </Link>
              </div>
            </div>

            {/* Health Summary for non-admin users */}
            {user.tip !== 'admin' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Zdravstveni pregled</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-sm text-gray-600">Nadolazeći termini</p>
                  </div>
                  
                  <div className="text-center p-4 bg-rose-50 rounded-lg">
                    <Heart className="h-6 w-6 text-rose-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-rose-600">2</p>
                    <p className="text-sm text-gray-600">Aktivna stanja</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-sm text-gray-600">Završenih pregleda</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <Link
                    to="/medical-history"
                    className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium"
                  >
                    <Heart className="h-4 w-4" />
                    Pogledaj kompletnu medicinsku historiju
                  </Link>
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Postavke</h3>
              
              <div className="space-y-3">
                <Link
                  to="/settings/privacy"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Privatnost i sigurnost</span>
                  </div>
                  <div className="text-gray-400">›</div>
                </Link>
                
                <Link
                  to="/settings/notifications"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Notifikacije</span>
                  </div>
                  <div className="text-gray-400">›</div>
                </Link>
                
                <Link
                  to="/settings/account"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Upravljanje računom</span>
                  </div>
                  <div className="text-gray-400">›</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;