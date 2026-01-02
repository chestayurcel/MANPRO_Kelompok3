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

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// 1. Ambil Semua Booking (Admin)
export const getAllBookings = async () => {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader());
    return response.data.data;
};

// 2. Update Status Booking (Admin)
export const updateBookingStatus = async (id, status) => {
    // status dikirim sebagai object { status: 'lunas' } atau { status: 'batal' }
    await axios.put(`${API_URL}/${id}`, { status }, getAuthHeader());
};

// 3. Upload Bukti Bayar
export const uploadBuktiBayar = async (bookingId, file) => {
    const formData = new FormData();
    formData.append('bukti', file); // 'bukti' harus sama dengan di route backend (upload.single('bukti'))

    const response = await axios.post(`${API_URL}/${bookingId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Wajib untuk upload file
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};