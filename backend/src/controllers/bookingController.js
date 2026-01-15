const bcrypt = require('bcryptjs');
const { Booking, Room, User } = require('../models');
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

const deleteBookingByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await bookingService.deleteBookingByAdmin(id);

        res.json({ success: true, message: 'Booking berhasil dihapus.' });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createOfflineBooking = async (req, res) => {
    try {
        // Karena pakai FormData, data teks ada di req.body, file ada di req.file
        const { nama, email, no_hp, roomId, tanggal_masuk, durasi_bulan } = req.body;

        // Cek apakah ada file bukti yang diupload?
        // Jika ada pakai filenamenya, jika tidak pakai string default
        const bukti_bayar = req.file ? req.file.filename : 'OFFLINE_TRANSACTION';

        // A. CEK / BUAT USER
        let user = await User.findOne({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            user = await User.create({
                nama, email, no_hp, password: hashedPassword, role: 'penghuni'
            });
        }

        // B. CEK KAMAR
        const room = await Room.findByPk(roomId);
        if (!room || room.status !== 'tersedia') {
            return res.status(400).json({ message: 'Kamar tidak ditemukan atau sedang terisi' });
        }

        const total_harga = room.harga_per_bulan * durasi_bulan;

        // C. BUAT BOOKING
        const newBooking = await Booking.create({
            userId: user.id,
            roomId,
            tanggal_masuk,
            durasi_bulan,
            total_harga,
            status_pembayaran: 'lunas',
            bukti_bayar: bukti_bayar // <--- SIMPAN NAMA FILE DI SINI
        });

        // D. UPDATE KAMAR
        await Room.update({ status: 'terisi' }, { where: { id: roomId } });

        res.status(201).json({
            success: true,
            message: 'Booking offline berhasil disimpan!',
            data: newBooking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateBookingByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id;

        const booking = await Booking.findOne({ where: { id, userId } });
        
        // Cek validasi
        if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
        if (booking.status_pembayaran !== 'pending') {
            return res.status(400).json({ message: 'Booking yang sudah diproses tidak bisa diedit!' });
        }

        // Hitung ulang harga jika durasi berubah
        let total_harga = booking.total_harga;
        if (durasi_bulan) {
            const room = await Room.findByPk(booking.roomId);
            total_harga = room.harga_per_bulan * durasi_bulan;
        }

        // Update data
        await booking.update({
            tanggal_masuk: tanggal_masuk || booking.tanggal_masuk,
            durasi_bulan: durasi_bulan || booking.durasi_bulan,
            total_harga: total_harga
        });

        res.json({ success: true, message: 'Data booking berhasil diperbarui!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelBookingByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findOne({ where: { id, userId } });

        if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
        if (booking.status_pembayaran !== 'pending') {
            return res.status(400).json({ message: 'Hanya booking pending yang bisa dibatalkan.' });
        }

        // Hapus booking dari database (Hard Delete) agar kamar bersih
        await booking.destroy();

        res.json({ success: true, message: 'Booking berhasil dibatalkan.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
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