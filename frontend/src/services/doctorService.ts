import api from './api';
import { Doctor, DoctorFilters, DoctorsResponse } from '../types';

export interface CreateDoctorData {
  // User podaci
  ime: string;
  prezime: string;
  email: string;
  password: string;
  datumRodjenja: string;
  spol?: 'muški' | 'ženski' | 'ostalo';
  telefon?: string;
  adresa?: string;
  grad: string;
  // Doctor podaci
  specialnosti: string[];
  bolnica: string;
  opis?: string;
  iskustvo: number;
  obrazovanje?: string[];
  certifikati?: string[];
  jezici?: string[];
  cijenaKonsultacije: number;
  radnoVrijeme?: {
    [key: string]: { pocetak: string; kraj: string };
  };
}

export const doctorService = {
  // Dobij sve doktore sa filtriranjem
  async getDoctors(filters?: DoctorFilters): Promise<DoctorsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.specialnost) {
      params.append('specialnost', filters.specialnost);
    }
    if (filters?.grad) {
      params.append('grad', filters.grad);
    }
    if (filters?.spol) {
      params.append('spol', filters.spol);
    }
    if (filters?.jezik) {
      params.append('jezik', filters.jezik);
    }
    if (filters?.rating) {
      params.append('minRating', filters.rating.toString());
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    const response = await api.get(`/doctors?${params.toString()}`);
    return response.data;
  },

  // Dobij doktora po ID-u
  async getDoctorById(id: string): Promise<{ success: boolean; data: Doctor }> {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Kreiraj novog doktora (samo admin)
  async createDoctor(data: CreateDoctorData): Promise<{ success: boolean; message: string; data: Doctor }> {
    const response = await api.post('/doctors', data);
    return response.data;
  },

  // Ažuriraj doktora
  async updateDoctor(id: string, data: Partial<CreateDoctorData>): Promise<{ success: boolean; message: string; data: Doctor }> {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },

  // Obriši doktora (samo admin)
  async deleteDoctor(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  }
};


