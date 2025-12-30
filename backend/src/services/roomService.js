// backend/src/services/roomService.js
const { Room } = require('../models');

const getAllRooms = async () => {
    // Mengambil semua data dari tabel Room
    const rooms = await Room.findAll();
    return rooms;
};

const getRoomById = async (id) => {
    const room = await Room.findByPk(id);
    return room;
};

module.exports = {
    getAllRooms,
    getRoomById
};