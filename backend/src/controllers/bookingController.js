const bcrypt = require('bcryptjs');
const { Booking, Room, User } = require('../models');

// FITUR UNTUK PENGHUNI (USER)
// 1. MEMBUAT BOOKING BARU
const createBooking = async (req, res) => {
    try {
        const { roomId, tanggal_masuk, durasi_bulan } = req.body;
        const userId = req.user.id; 

        // ============================================================
        // 1. CEK DOUBLE BOOKING (LOGIKA BARU ✨)
        // ============================================================
        const existingBooking = await Booking.findOne({
            where: {
                userId: userId,           // User yang sama
                roomId: roomId,           // Kamar yang sama
                status_pembayaran: 'pending' // Masih menunggu konfirmasi
            }
        });

        if (existingBooking) {
            return res.status(400).json({ 
                message: 'Anda sudah mem-booking kamar ini. Mohon tunggu konfirmasi admin atau cek riwayat Anda.' 
            });
        }

        // ============================================================
        // 2. CEK KETERSEDIAAN KAMAR (LANJUTAN BIASA)
        // ============================================================
        const room = await Room.findByPk(roomId);
        if (!room) return res.status(404).json({ message: 'Kamar tidak ditemukan' });

        if (room.status !== 'tersedia') {
            return res.status(400).json({ message: 'Maaf, kamar ini baru saja terisi.' });
        }

        const total_harga = room.harga_per_bulan * durasi_bulan;

        // 3. BUAT BOOKING BARU
        const newBooking = await Booking.create({
            userId, 
            roomId, 
            tanggal_masuk, 
            durasi_bulan, 
            total_harga,
            status_pembayaran: 'pending' 
        });

        // Ingat: Jangan ubah status Room jadi 'pending' (sesuai diskusi sebelumnya)
        // Biarkan tetap 'tersedia' agar user lain masih bisa lihat, 
        // tapi user INI tidak bisa spam booking lagi.

        res.status(201).json({ 
            success: true, 
            message: 'Booking berhasil! Silakan lakukan pembayaran.', 
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

// 4. UPDATE STATUS BOOKING
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = req.body.status_pembayaran || req.body.status;

        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });

        // Update status booking (Lunas/Batal)
        await booking.update({ status_pembayaran: status });

        // LOGIKA BARU:
        // Jika Admin MENYETUJUI (Lunas), barulah kita kunci kamarnya (Status Room jadi 'terisi')
        if (status === 'lunas') {
            await Room.update({ status: 'terisi' }, { where: { id: booking.roomId } });
            
            // (Opsional) Tolak bookingan lain untuk kamar yang sama secara otomatis?
            // Bisa ditambahkan nanti kalau perlu.
        }
        
        // Jika Batal, pastikan kamar tetap 'tersedia'
        if (status === 'batal') {
            await Room.update({ status: 'tersedia' }, { where: { id: booking.roomId } });
        }

        res.status(200).json({ success: true, message: `Status berhasil diubah menjadi ${status}` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. FUNGSI UPLOAD BUKTI BAYAR
const uploadBuktiBayar = async (req, res) => {
    try {
        const { id } = req.params; // ID Booking
        
        // Cek apakah ada file yang diupload
        if (!req.file) {
            return res.status(400).json({ message: 'Silakan upload file bukti pembayaran' });
        }

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking tidak ditemukan' });
        }

        // Simpan path/nama file ke database
        // req.file.filename adalah nama file yang dihasilkan oleh Multer
        await booking.update({ bukti_bayar: req.file.filename });

        res.status(200).json({ 
            success: true, 
            message: 'Bukti pembayaran berhasil diupload',
            data: booking 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
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

// 8. USER CANCEL BOOKING
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
    updateBookingByUser, // <-- Tambah ini
    cancelBookingByUser
};