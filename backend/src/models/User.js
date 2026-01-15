const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Email tidak boleh kembar
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'penghuni'),
        defaultValue: 'penghuni'
    },
    no_hp: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: 'user',
    timestamps: true
});

module.exports = User;