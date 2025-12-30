const { Booking, Room } = require('../models');

const createBooking = async (req, res) => {
    try {
        const { roomId, tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id; // Didapat dari Token

        // Cek dulu apakah kamarnya masih ada?
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        if (room.status !== 'tersedia') {
            return res.status(400).json({ message: 'Kamar sudah terisi!' });
        }

        // Hitung Total Harga
        const total_harga = room.harga_per_bulan * durasi_bulan;

        // Simpan Booking
        const newBooking = await Booking.create({
            userId,
            roomId,
            tanggal_masuk,
            durasi_bulan,
            total_harga,
            status_pembayaran: 'pending' // Default pending dulu
        });
        
        await room.update({ status: 'terisi' });

        res.status(201).json({
            success: true,
            message: 'Booking berhasil dibuat!',
            data: newBooking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat booking', error: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.findAll({
            where: { userId },
            include: [{ model: Room }] // Sertakan data kamarnya juga
        });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil riwayat booking' });
    }
};

// AMBIL SEMUA BOOKING (KHUSUS ADMIN)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Room }, // Sertakan data Kamar
                { model: User, attributes: ['nama', 'email', 'no_hp'] } // Sertakan data User
            ],
            order: [['createdAt', 'DESC']] // Yang terbaru di atas
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data booking' });
    }
};

// UPDATE STATUS BOOKING (SETUJUI / TOLAK)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // status bisa 'lunas' (disetujui) atau 'batal' (ditolak)

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking tidak ditemukan' });
        }

        // Update status booking
        await booking.update({ status_pembayaran: status });

        // LOGIKA PENTING:
        // Jika Admin MENOLAK (Batal), kembalikan status kamar jadi 'tersedia'
        if (status === 'batal') {
            await Room.update(
                { status: 'tersedia' },
                { where: { id: booking.roomId } }
            );
        }
        
        // Jika Admin MENYETUJUI (Lunas), pastikan kamar tetap 'terisi'
        if (status === 'lunas') {
             await Room.update(
                { status: 'terisi' },
                { where: { id: booking.roomId } }
            );
        }

        res.status(200).json({ success: true, message: 'Status booking diperbarui' });
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