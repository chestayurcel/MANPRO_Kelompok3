// frontend/src/services/roomService.js
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const getAllRooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rooms`);
        
        if (response.data && response.data.data) {
            return response.data.data; 
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        
        return [];
    } catch (error) {
        console.error("Gagal mengambil data rooms:", error);
        return [];
    }
};

export const getRoomDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Gagal mengambil detail kamar:", error);
    throw error;
  }
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const createRoom = async (roomData) => {
    const response = await axios.post(`${API_BASE_URL}/rooms`, roomData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const updateRoom = async (id, roomData) => {
    const response = await axios.put(`${API_BASE_URL}/rooms/${id}`, roomData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const deleteRoom = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/rooms/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};