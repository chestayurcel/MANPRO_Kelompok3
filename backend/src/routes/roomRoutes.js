// backend/src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const verifyToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');

// Public Routes
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomDetail);

// Admin Routes
router.post('/', verifyToken, isAdmin, roomController.createRoom);
router.put('/:id', verifyToken, isAdmin, roomController.updateRoom);
router.delete('/:id', verifyToken, isAdmin, roomController.deleteRoom);

module.exports = router;