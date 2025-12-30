// frontend/src/services/roomService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rooms';

export const getAllRooms = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw error;
  }
};

export const getRoomDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil detail kamar:", error);
    throw error;
  }
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const createRoom = async (data) => {
    await axios.post(API_URL, data, getAuthHeader());
};

export const updateRoom = async (id, data) => {
    await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
};

export const deleteRoom = async (id) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
};