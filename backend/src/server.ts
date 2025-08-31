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

app.get('/api/health', async (req, res) => {
  try {
    // Test MongoDB konekcije
    const mongoose = await import('mongoose');
    const dbStatus = mongoose.connection.readyState;
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.status(200).json({
      success: true,
      message: 'Server radi ispravno',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStates[dbStatus],
        connected: dbStatus === 1
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta nije pronađena'
  });
});

// Initialize database connection
let isConnected = false;

const initializeDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      console.log('✅ Povezan sa MongoDB bazom');
      isConnected = true;
    } catch (error) {
      console.error('❌ Greška pri konekciji sa MongoDB:', error);
      throw error;
    }
  }
};

// Standard server startup
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Povezan sa MongoDB bazom');
    
    // Seed bazu ako je prazna (samo u development)
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
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Greška pri pokretanju servera:', error);
    process.exit(1);
  }
};

startServer(); 