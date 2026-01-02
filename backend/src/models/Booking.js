const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Booking = db.define('Booking', {
    tanggal_masuk: {
        type: DataTypes.DATEONLY, // Hanya tanggal, tanpa jam
        allowNull: false
    },
    durasi_bulan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_harga: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bukti_bayar: {
      type: DataTypes.STRING, 
      allowNull: true // Boleh kosong di awal (saat baru booking)
    },
    status_pembayaran: {
        type: DataTypes.ENUM('pending', 'lunas', 'batal'),
        defaultValue: 'pending'
    }
    // Nanti ID User dan ID Room masuk otomatis lewat Relasi (Associations)
}, {
    freezeTableName: true
});

module.exports = Booking;