// frontend/src/services/roomService.js
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const getAllRooms = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw error;
  }
};

export const getRoomDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
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
    await axios.post(API_BASE_URL, data, getAuthHeader());
};

export const updateRoom = async (id, data) => {
    await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeader());
};

export const deleteRoom = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader());
};