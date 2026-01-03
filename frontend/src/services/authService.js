import axios from 'axios';
import API_BASE_URL from '../config/api';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Registrasi gagal');
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password
        });
        
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export const logoutUser = () => {
    // Hapus keduanya saat logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};