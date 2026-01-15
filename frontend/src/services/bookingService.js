import axios from 'axios';
import API_BASE_URL from '../config/api'; // Import dari config

const URL_BOOKING = `${API_BASE_URL}/bookings`;

// 1. Ambil SEMUA Booking (Khusus Admin)
export const getAllBookings = async () => {
    try {
        const response = await axios.get(URL_BOOKING, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error("Gagal ambil semua booking:", error);
        return [];
    }
};

// 2. Ambil Booking Saya Saja (Khusus Penghuni)
export const getMyBookings = async () => {
    try {
        const response = await axios.get(`${URL_BOOKING}/my-booking`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        return response.data.data || response.data || [];
    } catch (error) {
        console.error("Gagal ambil booking saya:", error);
        return [];
    }
};

// 3. Buat Booking Baru
export const createBooking = async (bookingData) => {
    const response = await axios.post(URL_BOOKING, bookingData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

// 4. Upload Bukti Bayar
export const uploadBuktiBayar = async (bookingId, file) => {
    const formData = new FormData();
    formData.append('bukti', file);

    const response = await axios.post(`${URL_BOOKING}/${bookingId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// 5. Update Status Pembayaran (Khusus Admin: Setujui/Tolak)
export const updateBookingStatus = async (bookingId, status) => {
    const response = await axios.put(`${URL_BOOKING}/${bookingId}`, { status_pembayaran: status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const createOfflineBooking = async (data) => {
    // Kirim data ke endpoint /offline
    const response = await axios.post(`${API_BASE_URL}/bookings/offline`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const updateBooking = async (id, data) => {
<<<<<<< HEAD
    const response = await axiosInstance.put(`/bookings/${id}/update`, data);
=======
    const response = await axios.put(`${URL_BOOKING}/${id}/update`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
    return response.data;
};

export const cancelBooking = async (id) => {
<<<<<<< HEAD
    const response = await axiosInstance.delete(`/bookings/${id}/cancel`);
=======
    const response = await axios.delete(`${URL_BOOKING}/${id}/cancel`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
    return response.data;
};