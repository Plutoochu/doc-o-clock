import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import doctorRoutes from './routes/doctors';
import clinicRoutes from './routes/clinics';
import appointmentRoutes from './routes/appointments';
import { seedDatabase } from './utils/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connectDB se poziva u startServer funkciji
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Previše zahtjeva sa ove IP adrese, pokušajte ponovo kasnije.'
});
app.use(limiter);

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173', 
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server radi ispravno',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta nije pronađena'
  });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Povezan sa MongoDB bazom');
    
    // Seed bazu ako je prazna
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seedDatabase();
      } catch (seedError) {
        console.warn('⚠️ Seed proces nije uspješan, ali server nastavlja:', seedError);
      }
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server pokrenut na portu ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend URL: http://localhost:5173`);
    });
  } catch (error) {
    console.error('❌ Greška pri pokretanju servera:', error);
    process.exit(1);
  }
};

startServer(); 