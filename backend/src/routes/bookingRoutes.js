const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');

// Semua route di bawah ini diproteksi oleh verifyToken
// User harus login (punya token) baru bisa akses

// Route User Biasa
router.post('/', verifyToken, bookingController.createBooking);
router.get('/my-booking', verifyToken, bookingController.getMyBookings);

// Route Admin
router.get('/all', verifyToken, isAdmin, bookingController.getAllBookings);
router.put('/:id', verifyToken, isAdmin, bookingController.updateBookingStatus);

module.exports = router;