const { Booking, Room } = require('../models');

const createBooking = async (req, res) => {
    try {
        const { roomId, tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id; // Didapat dari Token (lewat Middleware tadi)

        // 1. Cek dulu apakah kamarnya masih ada?
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        if (room.status !== 'tersedia') {
            return res.status(400).json({ message: 'Kamar sudah terisi!' });
        }

        // 2. Hitung Total Harga
        const total_harga = room.harga_per_bulan * durasi_bulan;

        // 3. Simpan Booking
        const newBooking = await Booking.create({
            userId,
            roomId,
            tanggal_masuk,
            durasi_bulan,
            total_harga,
            status_pembayaran: 'pending' // Default pending dulu
        });

        // 4. Update Status Kamar jadi 'terisi' (Opsional: bisa diubah nanti setelah bayar)
        // Untuk tutorial ini, kita anggap langsung ter-booking.
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

module.exports = { createBooking, getMyBookings };