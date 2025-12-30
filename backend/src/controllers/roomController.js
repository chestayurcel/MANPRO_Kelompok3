// backend/src/controllers/roomController.js
const roomService = require('../services/roomService');
const { Room, Booking, User } = require('../models');

const getRooms = async (req, res) => {
    try {
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
        
        res.status(200).json({ success: true, data: rooms }); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRoomDetail = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari URL
        const room = await roomService.getRoomById(id);
        
        if (!room) {
            return res.status(404).json({ success: false, message: 'Kamar tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail kamar',
            error: error.message
        });
    }
};

const createRoom = async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);
        res.status(201).json({ success: true, message: 'Kamar berhasil dibuat', data: newRoom });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Room.update(req.body, { where: { id } });
        
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Kamar berhasil diupdate' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Room.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Kamar berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getRooms,
    getRoomDetail,
    createRoom,
    updateRoom,
    deleteRoom
};