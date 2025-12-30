const { Booking, Room, User } = require('../models');

// FITUR UNTUK PENGHUNI (USER)
// 1. MEMBUAT BOOKING BARU
const createBooking = async (req, res) => {
    try {
        const { roomId, tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id; // Didapat dari token (middleware verifyToken)

        // Cek apakah kamar ada dan tersedia
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }

        if (room.status !== 'tersedia') {
            return res.status(400).json({ message: 'Kamar sudah terisi atau sedang diperbaiki' });
        }

        // Hitung Total Harga
        const total_harga = room.harga_per_bulan * durasi_bulan;

        // Buat Data Booking
        const newBooking = await Booking.create({
            userId,
            roomId,
            tanggal_masuk,
            durasi_bulan,
            total_harga,
            status_pembayaran: 'pending' // Default status menunggu persetujuan admin
        });

        // Update Status Kamar menjadi 'terisi' agar tidak dibooking orang lain
        await Room.update({ status: 'terisi' }, { where: { id: roomId } });

        res.status(201).json({ 
            success: true, 
            message: 'Booking berhasil dibuat, menunggu persetujuan admin.', 
            data: newBooking 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. MELIHAT RIWAYAT BOOKING SAYA (PENGHUNI)
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                { model: Room } // Sertakan detail kamar
            ],
            order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
        });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil riwayat booking' });
    }
};

// FITUR UNTUK ADMIN
// 3. MELIHAT SEMUA BOOKING DARI SEMUA USER (ADMIN)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Room }, // Sertakan data Kamar
                { model: User, attributes: ['nama', 'email', 'no_hp'] } // Sertakan data User (tanpa password)
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data booking' });
    }
};

// 4. UPDATE STATUS BOOKING (SETUJUI / TOLAK)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // status yang dikirim: 'lunas' atau 'batal'

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking tidak ditemukan' });
        }

        // Update status booking di database
        await booking.update({ status_pembayaran: status });

        // --- LOGIKA SINKRONISASI STATUS KAMAR ---
        
        // A. Jika Admin MENOLAK (status jadi 'batal'):
        // Kembalikan status kamar jadi 'tersedia' agar bisa dibooking orang lain.
        if (status === 'batal') {
            await Room.update(
                { status: 'tersedia' },
                { where: { id: booking.roomId } }
            );
        }
        
        // B. Jika Admin MENYETUJUI (status jadi 'lunas'):
        // Pastikan status kamar tetap 'terisi'.
        if (status === 'lunas') {
             await Room.update(
                { status: 'terisi' },
                { where: { id: booking.roomId } }
            );
        }

        res.status(200).json({ success: true, message: `Status booking berhasil diubah menjadi ${status}` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
};