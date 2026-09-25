// Centralized API Base URL configuration supporting localhost, mobile local network IPs, and production environments
export const getApiBaseUrl = () => {
  const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL;
    // If VITE_API_URL points to localhost but app is opened via mobile IP (e.g., 192.168.x.x), replace localhost with mobile IP
    if (envUrl.includes('localhost') && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return envUrl.replace('localhost', hostname);
    }
    return envUrl;
  }

  return `http://${hostname}:5000/api`;
};

export const API_BASE_URL = getApiBaseUrl();

