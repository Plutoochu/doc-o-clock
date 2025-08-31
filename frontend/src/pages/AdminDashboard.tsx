import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  UserPlus, 
  Users, 
  Stethoscope, 
  Building2, 
  Calendar, 
  BarChart3, 
  ArrowRight, 
  Plus,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    ukupniKorisnici: 0,
    aktivniKorisnici: 0,
    doktori: 0,
    korisnici: 0,
    klinike: 0,
    termini: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Mock podaci - trebat će API pozivi kasnije
      setStats({
        ukupniKorisnici: 156,
        aktivniKorisnici: 142,
        doktori: 23,
        korisnici: 128,
        klinike: 8,
        termini: 347
      });
    } catch (error) {
      console.error('Greška pri učitavanju statistika:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
            <BarChart3 className="h-6 w-6 text-rose-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Upravljanje Doc O'Clock platformom</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ukupno korisnika</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ukupniKorisnici}</p>
                <p className="text-sm text-green-600">{stats.aktivniKorisnici} aktivnih</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doktori</p>
                <p className="text-2xl font-bold text-gray-900">{stats.doktori}</p>
                <p className="text-sm text-gray-500">Verifikovanih specijalizovanih</p>
              </div>
              <Stethoscope className="h-8 w-8 text-rose-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Korisnici</p>
                <p className="text-2xl font-bold text-gray-900">{stats.korisnici}</p>
                <p className="text-sm text-gray-500">Registrovanih korisnika</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Klinike</p>
                <p className="text-2xl font-bold text-gray-900">{stats.klinike}</p>
                <p className="text-sm text-gray-500">Verificirane ustanove</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Termini</p>
                <p className="text-2xl font-bold text-gray-900">{stats.termini}</p>
                <p className="text-sm text-gray-500">Ukupno zakazanih</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Doctor */}
          <Link
            to="/doctors/create"
            className="bg-white border border-gray-200 p-6 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <Stethoscope className="h-8 w-8 text-rose-500 group-hover:text-rose-600" />
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dodaj doktora</h3>
            <p className="text-gray-600">Kreiraj account za doktora ili bolničko osoblje</p>
          </Link>

          {/* Add Clinic */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="h-8 w-8 text-purple-500 group-hover:text-purple-600" />
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dodaj kliniku</h3>
            <p className="text-gray-600">Registruj novu medicinsku ustanovu</p>
          </div>

          {/* Manage Users */}
          <Link
            to="/users"
            className="bg-white border border-gray-200 p-6 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-500 group-hover:text-blue-600" />
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upravljaj korisnicima</h3>
            <p className="text-gray-600">Pregled, uređivanje i administracija korisnika</p>
          </Link>

          {/* View Appointments */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-orange-500 group-hover:text-orange-600" />
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pregled termina</h3>
            <p className="text-gray-600">Statistike i upravljanje terminima</p>
          </div>

          {/* System Settings */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-gray-500 group-hover:text-gray-600" />
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistemske postavke</h3>
            <p className="text-gray-600">Konfiguracija i održavanje sistema</p>
          </div>

          {/* Reports */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-green-500 group-hover:text-green-600" />
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Izvještaji</h3>
            <p className="text-gray-600">Analitika i business intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;