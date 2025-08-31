import React from 'react';
import { X, Stethoscope, MapPin, User, Star, Globe } from 'lucide-react';
import { DoctorFilters } from '../types';

interface FilterPanelProps {
  filters: DoctorFilters;
  setFilters: (filters: DoctorFilters) => void;
  onClose: () => void;
  specialnosti: string[];
  gradovi: string[];
  jezici: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  onClose,
  specialnosti,
  gradovi,
  jezici
}) => {
  const clearFilters = () => {
    setFilters({
      search: filters.search,
      specialnost: '',
      grad: '',
      spol: undefined,
      jezik: '',
      rating: undefined,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filteriraj pretragu</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Specijalizacije */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-rose-600" />
            Specijalizacije
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {specialnosti.map(spec => (
              <label key={spec} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name="specialnost"
                  value={spec}
                  checked={filters.specialnost === spec}
                  onChange={(e) => setFilters({
                    ...filters, 
                    specialnost: e.target.checked ? spec : ''
                  })}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700">{spec}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Lokacija */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-600" />
            Lokacija
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {gradovi.map(grad => (
              <label key={grad} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name="grad"
                  value={grad}
                  checked={filters.grad === grad}
                  onChange={(e) => setFilters({
                    ...filters, 
                    grad: e.target.checked ? grad : ''
                  })}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700">{grad}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Spol doktora */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-rose-600" />
            Spol doktora
          </h4>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
              <input
                type="radio"
                name="spol"
                value="muški"
                checked={filters.spol === 'muški'}
                onChange={(e) => setFilters({
                  ...filters, 
                  spol: e.target.checked ? 'muški' : undefined
                })}
                className="text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">Muški</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
              <input
                type="radio"
                name="spol"
                value="ženski"
                checked={filters.spol === 'ženski'}
                onChange={(e) => setFilters({
                  ...filters, 
                  spol: e.target.checked ? 'ženski' : undefined
                })}
                className="text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">Ženski</span>
            </label>
          </div>
        </div>
        
        {/* Jezici */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-rose-600" />
            Jezici
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {jezici.map(jezik => (
              <label key={jezik} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name="jezik"
                  value={jezik}
                  checked={filters.jezik === jezik}
                  onChange={(e) => setFilters({
                    ...filters, 
                    jezik: e.target.checked ? jezik : ''
                  })}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700">{jezik}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Rating */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-rose-600" />
            Minimalni rating
          </h4>
          <div className="flex flex-wrap gap-4">
            {[4.5, 4.0, 3.5, 3.0].map(rating => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => setFilters({
                    ...filters, 
                    rating: e.target.checked ? rating : undefined
                  })}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  {rating}+ <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Sortiranje */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Sortiraj rezultate
          </h4>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({...filters, sortBy: sortBy as any, sortOrder: sortOrder as 'asc' | 'desc'});
            }}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="rating-desc">Najbolji rating</option>
            <option value="cijenaKonsultacije-asc">Najniža cijena</option>
            <option value="cijenaKonsultacije-desc">Najveća cijena</option>
            <option value="iskustvo-desc">Najveće iskustvo</option>
          </select>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={clearFilters}
          className="text-rose-600 hover:text-rose-700 text-sm font-medium"
        >
          Obriši filtere
        </button>
        
        <button
          onClick={onClose}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          Primijeni filtere
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
