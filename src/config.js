// API Configuration
// In development, uses localhost
// In production, uses environment variable from Vercel
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4010';

