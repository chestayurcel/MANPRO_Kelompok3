const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (userData) => {
    // 1. Cek apakah email sudah terdaftar?
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email sudah terdaftar!');
    }

    // 2. Enkripsi password (Hashing)
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Simpan ke database
    const newUser = await User.create({
        ...userData,
        password: hashedPassword, // Simpan password yang sudah diacak
        role: 'penghuni' // Default user biasa
    });

    return newUser;
};

const login = async (email, password) => {
    // 1. Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email tidak ditemukan');
    }

    // 2. Cek apakah password cocok?
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Password salah');
    }

    // 3. Jika cocok, buatkan Token (Gelang Tiket)
    const token = jwt.sign(
        { id: user.id, role: user.role, nama: user.nama }, // Data di dalam token
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token berlaku 1 hari
    );

    return { user, token };
};

module.exports = { register, login };