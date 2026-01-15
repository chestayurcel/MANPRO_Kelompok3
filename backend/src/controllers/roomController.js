// backend/src/controllers/roomController.js
const roomService = require('../services/roomService');

const getRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRoomDetail = async (req, res) => {
    try {
        const { id } = req.params;
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
        const roomData = { ...req.body };
        if (req.file) {
            roomData.foto_url = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const newRoom = await roomService.createRoom(roomData);
        res.status(201).json({ success: true, message: 'Kamar berhasil dibuat', data: newRoom });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const roomData = { ...req.body };
        if (req.file) {
            roomData.foto_url = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        await roomService.updateRoom(id, roomData);
        res.status(200).json({ success: true, message: 'Kamar berhasil diupdate' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        await roomService.deleteRoom(id);
        res.status(200).json({ success: true, message: 'Kamar berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getRooms,
    getRoomDetail,
    createRoom,
    updateRoom,
    deleteRoom
};