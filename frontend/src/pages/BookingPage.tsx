import React, { useState } from 'react';
import { Calendar, Clock, User, CreditCard, Check, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentData {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
  duration: number;
  paymentMethod: 'gotovina' | 'kartica';
}

const BookingPage = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<AppointmentData>({
    doctorId: doctorId || '',
    date: '',
    time: '',
    reason: '',
    notes: '',
    duration: 30,
    paymentMethod: 'gotovina'
  });

  // Mock doctor data
  const doctor = {
    id: doctorId || '1',
    name: 'Dr. Alma Ahmetović',
    specialty: 'Ginekologija',
    hospital: 'Dr. Abdulah Nakas General Hospital',
    price: 80,
    image: '/api/placeholder/80/80'
  };

  // Generate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  // Generate time slots for selected date
  const getTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const times = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    
    // Mock availability - some slots are taken
    const unavailableSlots = ['09:00', '10:30', '14:00', '16:00'];
    
    times.forEach(time => {
      slots.push({
        time,
        available: !unavailableSlots.includes(time)
      });
    });
    
    return slots;
  };

  const timeSlots = selectedDate ? getTimeSlots(selectedDate) : [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setBookingData(prev => ({ ...prev, date }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingData(prev => ({ ...prev, time }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = async () => {
    try {
      // API poziv za kreiranje termina
      console.log('Booking appointment:', bookingData);
      
      // Simulacija API poziva
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to appointments page
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Zakaži termin</h1>
              <p className="text-gray-600">Odaberi datum i vrijeme</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map(step => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step <= currentStep 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-rose-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Date & Time Selection */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Odaberi datum
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  {getAvailableDates().slice(0, 12).map(date => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 text-center rounded-lg border transition-colors ${
                        selectedDate === date
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs text-gray-500">
                        {new Date(date).toLocaleDateString('bs-BA', { weekday: 'short' })}
                      </div>
                      <div className="font-medium">
                        {new Date(date).getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(date).toLocaleDateString('bs-BA', { month: 'short' })}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Dostupni termini za {formatDate(selectedDate)}
                    </h3>
                    
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 text-center rounded-lg border transition-colors ${
                            !slot.available
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : selectedTime === slot.time
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Detalji termina
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razlog posjete *
                    </label>
                    <select
                      value={bookingData.reason}
                      onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      required
                    >
                      <option value="">Odaberite razlog</option>
                      <option value="Rutinska kontrola">Rutinska kontrola</option>
                      <option value="Pregled">Pregled</option>
                      <option value="Konsultacija">Konsultacija</option>
                      <option value="Drugo">Drugo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dodatne napomene
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      placeholder="Opišite simptome ili dodatne informacije..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trajanje termina
                    </label>
                    <select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value={30}>30 minuta</option>
                      <option value={45}>45 minuta</option>
                      <option value={60}>60 minuta</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Način plaćanja
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      bookingData.paymentMethod === 'gotovina' 
                        ? 'border-rose-500 bg-rose-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="gotovina"
                        checked={bookingData.paymentMethod === 'gotovina'}
                        onChange={(e) => setBookingData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Gotovina</div>
                        <div className="text-sm text-gray-500">Plaćanje na licu mjesta</div>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      bookingData.paymentMethod === 'kartica' 
                        ? 'border-rose-500 bg-rose-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="kartica"
                        checked={bookingData.paymentMethod === 'kartica'}
                        onChange={(e) => setBookingData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Kartica</div>
                        <div className="text-sm text-gray-500">Online plaćanje</div>
                      </div>
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Rezime termina</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Datum:</span>
                        <span>{selectedDate && formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vrijeme:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trajanje:</span>
                        <span>{bookingData.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Razlog:</span>
                        <span>{bookingData.reason}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Ukupno:</span>
                        <span>{doctor.price} KM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{doctor.hospital}</p>
              
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-gray-600">Cijena konsultacije:</span>
                <span className="font-semibold text-gray-900">{doctor.price} KM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Nazad
          </button>
          
          <button
            onClick={currentStep === 3 ? handleBooking : handleNext}
            disabled={
              (currentStep === 1 && (!selectedDate || !selectedTime)) ||
              (currentStep === 2 && !bookingData.reason)
            }
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 3 ? 'Potvrdi termin' : 'Dalje'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;


