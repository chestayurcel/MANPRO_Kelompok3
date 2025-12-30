const db = require('../config/database');
const User = require('./User');
const Room = require('./Room');
const Booking = require('./Booking');

// Definisi Relasi
// 1. User bisa punya banyak Booking
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// 2. Room bisa punya banyak Booking (riwayat), tapi satu Booking untuk satu Room
Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = {
    db,
    User,
    Room,
    Booking
};