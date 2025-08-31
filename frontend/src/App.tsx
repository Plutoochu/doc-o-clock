import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';


import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './pages/UserDetailsPage';
import PostsPage from './pages/PostsPage';
import PostDetailsPage from './pages/PostDetailsPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import EditUserPage from './pages/EditUserPage';
import SearchPage from './pages/SearchPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CreateDoctorPage from './pages/CreateDoctorPage';
import MedicalConditionsPage from './pages/MedicalConditionsPage';
import ClinicsPage from './pages/ClinicsPage';
import ClinicDetailsPage from './pages/ClinicDetailsPage';
import BookingPage from './pages/BookingPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="clinics" element={<ClinicsPage />} />
            
            {}
            <Route element={<PrivateRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="medical-history" element={<MedicalConditionsPage />} />
              <Route path="clinics/:id" element={<ClinicDetailsPage />} />
              <Route path="book/:doctorId" element={<BookingPage />} />
              <Route path="chat/:userId" element={<ChatPage />} />
            </Route>
            
            {}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailsPage />} />
              <Route path="users/:id/edit" element={<EditUserPage />} />
              <Route path="doctors/create" element={<CreateDoctorPage />} />
            </Route>
          </Route>
          
          {}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Stranica nije pronađena</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App; 
 