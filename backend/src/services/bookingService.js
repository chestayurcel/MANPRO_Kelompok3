// backend/src/services/bookingService.js
const { Booking, Room, User } = require('../models');
const bcrypt = require('bcryptjs');

const createBooking = async (userId, roomId, tanggal_masuk, durasi_bulan) => {
    // 1. CEK DOUBLE BOOKING
    const existingBooking = await Booking.findOne({
        where: {
            userId: userId,
            roomId: roomId,
            status_pembayaran: 'pending'
        }
    });

    if (existingBooking) {
        throw new Error('Anda sudah mem-booking kamar ini. Mohon tunggu konfirmasi admin atau cek riwayat Anda.');
    }

    // 2. CEK KETERSEDIAAN KAMAR
    const room = await Room.findByPk(roomId);
    if (!room) throw new Error('Kamar tidak ditemukan');

    if (room.status !== 'tersedia') {
        throw new Error('Maaf, kamar ini baru saja terisi.');
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

    return newBooking;
};

const getMyBookings = async (userId) => {
    const bookings = await Booking.findAll({
        where: { userId },
        include: [{ model: Room }],
        order: [['createdAt', 'DESC']]
    });
    return bookings;
};

const getAllBookings = async () => {
    const bookings = await Booking.findAll({
        include: [
            { model: Room },
            { model: User, attributes: ['nama', 'email', 'no_hp'] }
        ],
        order: [['createdAt', 'DESC']]
    });
    return bookings;
};

const updateBookingStatus = async (id, status) => {
    const booking = await Booking.findByPk(id);
    if (!booking) throw new Error('Booking tidak ditemukan');

    await booking.update({ status_pembayaran: status });

    if (status === 'lunas') {
        await Room.update({ status: 'terisi' }, { where: { id: booking.roomId } });
    } else if (status === 'batal') {
        await Room.update({ status: 'tersedia' }, { where: { id: booking.roomId } });
    }

    return booking;
};

const uploadBuktiBayar = async (id, filename) => {
    const booking = await Booking.findByPk(id);
    if (!booking) throw new Error('Booking tidak ditemukan');

    await booking.update({ bukti_bayar: filename });
    return booking;
};

const createOfflineBooking = async (nama, email, no_hp, roomId, tanggal_masuk, durasi_bulan, bukti_bayar) => {
    let user = await User.findOne({ where: { email } });
    if (!user) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        user = await User.create({
            nama, email, no_hp, password: hashedPassword, role: 'penghuni'
        });
    }

    const room = await Room.findByPk(roomId);
    if (!room || room.status !== 'tersedia') {
        throw new Error('Kamar tidak ditemukan atau sedang terisi');
    }

    const total_harga = room.harga_per_bulan * durasi_bulan;

    const newBooking = await Booking.create({
        userId: user.id,
        roomId,
        tanggal_masuk,
        durasi_bulan,
        total_harga,
        status_pembayaran: 'lunas',
        bukti_bayar: bukti_bayar
    });

    await Room.update({ status: 'terisi' }, { where: { id: roomId } });

    return newBooking;
};

const updateBookingByUser = async (id, userId, tanggal_masuk, durasi_bulan) => {
    const booking = await Booking.findOne({ where: { id, userId } });

    if (!booking) throw new Error('Booking tidak ditemukan');
    if (booking.status_pembayaran !== 'pending') {
        throw new Error('Booking yang sudah diproses tidak bisa diedit!');
    }

    let total_harga = booking.total_harga;
    if (durasi_bulan) {
        const room = await Room.findByPk(booking.roomId);
        total_harga = room.harga_per_bulan * durasi_bulan;
    }

    await booking.update({
        tanggal_masuk: tanggal_masuk || booking.tanggal_masuk,
        durasi_bulan: durasi_bulan || booking.durasi_bulan,
        total_harga: total_harga
    });

    return booking;
};

const cancelBookingByUser = async (id, userId) => {
    const booking = await Booking.findOne({ where: { id, userId } });

    if (!booking) throw new Error('Booking tidak ditemukan');
    if (booking.status_pembayaran !== 'pending') {
        throw new Error('Hanya booking pending yang bisa dibatalkan.');
    }

    await booking.destroy();
    return true;
};

const deleteBookingByAdmin = async (id) => {
    const booking = await Booking.findByPk(id);
    if (!booking) throw new Error('Booking tidak ditemukan');

    const roomId = booking.roomId;
    const wasLunas = booking.status_pembayaran === 'lunas';

    await booking.destroy();

    // Set room to tersedia (assuming deleted booking was occupying it)
    await require('../models').Room.update({ status: 'tersedia' }, { where: { id: roomId } });

    return true;
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