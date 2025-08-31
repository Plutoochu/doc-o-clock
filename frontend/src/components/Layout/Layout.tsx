import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 mt-auto">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-200">
            © 2025 Doc O'Clock
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 