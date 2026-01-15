// backend/src/services/roomService.js
const { Room, Booking, User } = require('../models');

const getAllRooms = async () => {
    const rooms = await Room.findAll({
        include: [
            {
                model: Booking,
                where: { status_pembayaran: 'lunas' },
                required: false,
                limit: 1,
                order: [['updatedAt', 'DESC']],
                include: [
                    {
                        model: User,
                        attributes: ['nama']
                    }
                ]
            }
        ]
    });
    return rooms;
};

const getRoomById = async (id) => {
    const room = await Room.findByPk(id);
    return room;
};

const createRoom = async (roomData) => {
    const newRoom = await Room.create(roomData);
    return newRoom;
};

const updateRoom = async (id, roomData) => {
    const [updated] = await Room.update(roomData, { where: { id } });
    if (updated === 0) throw new Error('Kamar tidak ditemukan');
    return true;
};

const deleteRoom = async (id) => {
    const deleted = await Room.destroy({ where: { id } });
    if (!deleted) throw new Error('Kamar tidak ditemukan');
    return true;
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};