const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Room = db.define('Room', {
    nomor_kamar: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    tipe: {
        type: DataTypes.STRING, // Contoh: 'AC', 'Non-AC'
        defaultValue: 'Regular'
    },
    harga_per_bulan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fasilitas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('tersedia', 'terisi', 'perbaikan'),
        defaultValue: 'tersedia'
    },
    foto_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = Room;