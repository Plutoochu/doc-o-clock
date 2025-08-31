import User from '../models/User';
import Doctor from '../models/Doctor';
import Clinic from '../models/Clinic';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Početak seed procesa...');

    // Provjeri da li već postoje podaci
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📊 Baza već sadrži podatke, preskačem seed.');
      return;
    }

    // Kreiraj admin korisnika
    const adminUser = new User({
      ime: 'Admin',
      prezime: 'System',
      email: 'admin@dococlock.ba',
      password: 'admin123',
      grad: 'Sarajevo',
      tip: 'admin'
    });
    await adminUser.save();
    console.log('👤 Admin korisnik kreiran');

    // Kreiraj test korisnika
    const patientUser = new User({
      ime: 'Marko',
      prezime: 'Marković',
      email: 'marko@example.com',
      password: 'password123',
      datumRodjenja: '1990-05-15',
      spol: 'muški',
      telefon: '+387 61 123 456',
      adresa: 'Zmaja od Bosne 12',
      grad: 'Sarajevo',
      tip: 'patient'
    });
    await patientUser.save();
    console.log('👤 Test korisnik kreiran');

    // Kreiraj doktor korisnika
    const doctorUser = new User({
      ime: 'Alma',
      prezime: 'Ahmetović',
      email: 'alma@dococlock.ba',
      password: 'doctor123',
      datumRodjenja: '1980-03-22',
      spol: 'ženski',
      telefon: '+387 61 234 567',
      adresa: 'Kranjčevićeva 12',
      grad: 'Sarajevo',
      tip: 'doctor'
    });
    await doctorUser.save();

    // Kreiraj doktor profil
    const doctor = new Doctor({
      user: doctorUser._id,
      specialnosti: ['Ginekologija'],
      bolnica: 'Dr. Abdulah Nakas General Hospital',
      opis: 'Iskusna ginekolog sa 15 godina iskustva u reproduktivnoj medicini.',
      iskustvo: 15,
      obrazovanje: ['Medicinski fakultet Sarajevo', 'Specijalizacija ginekologija'],
      certifikati: ['Board certified in Gynecology'],
      jezici: ['Bosanski', 'Engleski'],
      cijenaKonsultacije: 80,
      rating: {
        prosjecna: 4.8,
        brojOcjena: 127
      },
      radnoVrijeme: {
        ponedjeljak: { pocetak: '08:00', kraj: '16:00' },
        utorak: { pocetak: '08:00', kraj: '16:00' },
        srijeda: { pocetak: '08:00', kraj: '16:00' },
        cetvrtak: { pocetak: '08:00', kraj: '16:00' },
        petak: { pocetak: '08:00', kraj: '14:00' }
      },
      dostupnost: [],
      verifikovan: true,
      aktivan: true
    });
    await doctor.save();
    console.log('👩‍⚕️ Test doktor kreiran');

    // Kreiraj test kliniku
    const clinic = new Clinic({
      naziv: 'Dr. Abdulah Nakas General Hospital',
      opis: 'Vodeća javna bolnica u Sarajevu sa širokim spektrom medicinskih usluga.',
      adresa: 'Kranjčevićeva 12',
      grad: 'Sarajevo',
      telefon: '+387 33 285 100',
      email: 'info@ukcs.ba',
      website: 'https://ukcs.ba',
      tip: 'Bolnica',
      specialnosti: ['Kardiologija', 'Neurologija', 'Ortopedija', 'Ginekologija'],
      usluge: [
        'Hitna medicinska pomoć',
        'Ambulantno liječenje',
        'Bolničko liječenje',
        'Dijagnostika'
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
        lat: 43.8563,
        lng: 18.4131,
        adresa: 'Kranjčevićeva 12, Sarajevo'
      },
      parking: true,
      pristupInvalidima: true,
      rating: {
        prosjecna: 4.2,
        brojOcjena: 847
      },
      verifikovana: true,
      aktivna: true
    });
    await clinic.save();
    console.log('🏥 Test klinika kreirana');

    console.log('✅ Seed proces završen uspješno!');
    console.log(`📧 Admin login: admin@dococlock.ba / admin123`);
    console.log(`📧 Doktor login: alma@dococlock.ba / doctor123`);
    console.log(`📧 Korisnik login: marko@example.com / password123`);
    
  } catch (error) {
    console.error('❌ Greška pri seed procesu:', error);
    throw error;
  }
};
