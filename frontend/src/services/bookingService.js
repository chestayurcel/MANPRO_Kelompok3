import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

export const getMyBookings = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) return []; // Kalau tidak ada token, kembalikan array kosong

  try {
    const response = await axios.get(`${API_URL}/my-booking`, {
      headers: {
        Authorization: `Bearer ${token}` // Wajib bawa token
      }
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal ambil riwayat:", error);
    throw error;
  }
};