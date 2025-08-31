// Utility funkcija za kreiranje URL-a za slike
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Ako već počinje sa http ili https, vraćamo kao što jeste
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Za development koristimo localhost, za produkciju relativnu putanju
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  // Ako imagePath već počinje sa /, ne dodajemo dupli /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
};

// Utility funkcija za API URL-ove
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${baseUrl}${cleanEndpoint}`;
};
