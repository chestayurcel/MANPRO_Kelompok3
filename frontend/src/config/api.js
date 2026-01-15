// frontend/src/config/api.js

// GANTI string di bawah ini dengan URL Backend Vercel kamu yang asli
const SERVER_URL = 'https://permatakost-api.vercel.app/api';    

const API_BASE_URL = import.meta.env.MODE === 'production'
  ? `${SERVER_URL}/api`              // Jika Online (Vercel)
  : 'http://localhost:5000/api';     // Jika Localhost (Laptop)

export default API_BASE_URL;