import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService'; // Pastikan path ini benar

const PrivateRoute = ({ children, isAdmin }) => {
    const user = getCurrentUser();

    // 1. Cek apakah user sudah login?
    if (!user) {
        // Jika belum, tendang ke halaman Login
        return <Navigate to="/login" />;
    }

    // 2. Jika halaman ini Khusus Admin, cek apakah user adalah Admin?
    if (isAdmin && user.role !== 'admin') {
        // Jika bukan admin, tendang ke halaman utama (Dashboard Penghuni)
        return <Navigate to="/rooms" />;
    }

    // 3. Jika aman, tampilkan halamannya
    return children;
};

export default PrivateRoute;