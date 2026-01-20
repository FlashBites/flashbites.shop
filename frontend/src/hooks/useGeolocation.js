import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback((options = {}) => {
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by your browser';
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    setLoading(true);
    setError(null);

    const defaultOptions = {
      enableHighAccuracy: false, // Use network location for faster response
      timeout: 15000, // Increased to 15 seconds
      maximumAge: 300000, // Accept cached position up to 5 minutes old
      ...options
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(locationData);
          setError(null);
          setLoading(false);
          console.log('📍 Location obtained:', locationData);
          resolve(locationData);
        },
        (err) => {
          let errorMessage = 'Unable to get your location';
          
          switch(err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              console.error('⛔ Location permission denied');
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please select a location manually.';
              console.warn('⚠️ Location unavailable - using manual selection fallback');
              break;
            case err.TIMEOUT:
              errorMessage = 'Location request timed out. Please select a location manually.';
              console.warn('⏱️ Location timeout - using manual selection fallback');
              break;
            default:
              errorMessage = 'Unable to determine location. Please select manually.';
              console.error('❌ Unknown location error:', err.message);
          }
          
          setError(errorMessage);
          setLoading(false);
          reject(err);
        },
        defaultOptions
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return { location, error, loading, getLocation, clearLocation };
};