const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middlewares/authMiddleware'); // Import Satpam

// Semua route di bawah ini diproteksi oleh verifyToken
// User harus login (punya token) baru bisa akses

// POST /api/bookings (Buat booking baru)
router.post('/', verifyToken, bookingController.createBooking);

// GET /api/bookings/my-booking (Lihat riwayat booking saya)
router.get('/my-booking', verifyToken, bookingController.getMyBookings);

module.exports = router;