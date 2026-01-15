const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
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

// Semua route di bawah ini diproteksi oleh verifyToken
// User harus login (punya token) baru bisa akses
router.post('/offline', verifyToken, isAdmin, upload.single('bukti'), bookingController.createOfflineBooking);
router.post('/', verifyToken, bookingController.createBooking);
router.get('/my-booking', verifyToken, bookingController.getMyBookings);
router.get('/', verifyToken, isAdmin, bookingController.getAllBookings);
router.put('/:id', verifyToken, isAdmin, bookingController.updateBookingStatus);
router.put('/:id/update', verifyToken, bookingController.updateBookingByUser);
router.delete('/:id/cancel', verifyToken, bookingController.cancelBookingByUser);
router.post('/:id/upload', verifyToken, upload.single('bukti'), bookingController.uploadBuktiBayar);
router.delete('/:id', verifyToken, isAdmin, bookingController.deleteBookingByAdmin);





module.exports = router;