const bookingService = require('../services/bookingService');

// FITUR UNTUK PENGHUNI (USER)
// 1. MEMBUAT BOOKING BARU
const createBooking = async (req, res) => {
    try {
        const { roomId, tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id;

        const newBooking = await bookingService.createBooking(userId, roomId, tanggal_masuk, durasi_bulan);

        res.status(201).json({
            success: true,
            message: 'Booking berhasil! Silakan lakukan pembayaran.',
            data: newBooking
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 2. MELIHAT RIWAYAT BOOKING SAYA (PENGHUNI)
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await bookingService.getMyBookings(userId);

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil riwayat booking' });
    }
};

// FITUR UNTUK ADMIN
// 3. MELIHAT SEMUA BOOKING DARI SEMUA USER (ADMIN)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data booking' });
    }
};

// 4. UPDATE BOOKING (STATUS OR DETAILS)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_pembayaran, status, tanggal_masuk, durasi_bulan, roomId } = req.body;

        const updateData = {};
        if (status_pembayaran || status) {
            updateData.status = status_pembayaran || status;
            await bookingService.updateBookingStatus(id, updateData.status);
        }

        if (tanggal_masuk || durasi_bulan || roomId) {
            // For admin edit details
            const { Booking, Room } = require('../models');
            const booking = await Booking.findByPk(id);
            if (!booking) throw new Error('Booking tidak ditemukan');

            const oldRoomId = booking.roomId;

            if (tanggal_masuk) booking.tanggal_masuk = tanggal_masuk;
            if (durasi_bulan) {
                booking.durasi_bulan = durasi_bulan;
                // Recalculate harga
                const room = await Room.findByPk(roomId || booking.roomId);
                booking.total_harga = room.harga_per_bulan * durasi_bulan;
            }
            if (roomId && roomId !== oldRoomId) {
                // Check if new room available
                const newRoom = await Room.findByPk(roomId);
                if (!newRoom || newRoom.status !== 'tersedia') throw new Error('Kamar baru tidak tersedia');

                // Update room statuses when changing room for lunas booking
                if (booking.status_pembayaran === 'lunas') {
                    // Old room: set to tersedia (assuming one active booking per room)
                    await Room.update({ status: 'tersedia' }, { where: { id: oldRoomId } });

                    // New room: set to terisi
                    await Room.update({ status: 'terisi' }, { where: { id: roomId } });
                }

                booking.roomId = roomId;
            }
            await booking.save();
        }

        res.status(200).json({ success: true, message: 'Booking berhasil diupdate' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. FUNGSI UPLOAD BUKTI BAYAR
const uploadBuktiBayar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'Silakan upload file bukti pembayaran' });
        }

        const booking = await bookingService.uploadBuktiBayar(id, req.file.filename);

        res.status(200).json({
            success: true,
            message: 'Bukti pembayaran berhasil diupload',
            data: booking
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createOfflineBooking = async (req, res) => {
    try {
        const { nama, email, no_hp, roomId, tanggal_masuk, durasi_bulan } = req.body;
        const bukti_bayar = req.file ? req.file.filename : 'OFFLINE_TRANSACTION';

        const newBooking = await bookingService.createOfflineBooking(nama, email, no_hp, roomId, tanggal_masuk, durasi_bulan, bukti_bayar);

        res.status(201).json({
            success: true,
            message: 'Booking offline berhasil disimpan!',
            data: newBooking
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateBookingByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id;

        await bookingService.updateBookingByUser(id, userId, tanggal_masuk, durasi_bulan);

        res.json({ success: true, message: 'Data booking berhasil diperbarui!' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 8. USER CANCEL BOOKING
const cancelBookingByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await bookingService.cancelBookingByUser(id, userId);

        res.json({ success: true, message: 'Booking berhasil dibatalkan.' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteBookingByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await bookingService.deleteBookingByAdmin(id);

        res.json({ success: true, message: 'Booking berhasil dihapus.' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    uploadBuktiBayar,
    createOfflineBooking,
    updateBookingByUser,
    cancelBookingByUser,
    deleteBookingByAdmin
};