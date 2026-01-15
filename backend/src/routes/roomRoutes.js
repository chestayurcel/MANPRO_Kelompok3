// backend/src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const verifyToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file untuk foto kamar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan di folder 'uploads' di root backend
    },
    filename: (req, file, cb) => {
        // Format nama file: timestamp-namasli.jpg (biar unik)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter hanya boleh gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya boleh upload file gambar!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Public Routes
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomDetail);

// Admin Routes
router.post('/', verifyToken, isAdmin, upload.single('foto'), roomController.createRoom);
router.put('/:id', verifyToken, isAdmin, upload.single('foto'), roomController.updateRoom);
router.delete('/:id', verifyToken, isAdmin, roomController.deleteRoom);

module.exports = router;