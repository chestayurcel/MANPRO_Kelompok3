const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { db } = require('./src/models');
const roomRoutes = require('./src/routes/roomRoutes');
const authRoutes = require('./src/routes/authRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', 
    credentials: true
}));
app.use(express.json());

// Serving Static Files (Hanya jalan efektif di Localhost)
// Di Vercel, folder uploads bersifat sementara, tapi kode ini tetap aman dibiarkan.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Route Pancingan (Cek Server Nyala/Mati)
app.get('/', (req, res) => {
    res.send('Backend Permata Kost is Running!');
});

// Fungsi untuk koneksi database (tanpa listen port)
const connectDB = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database connected');
        // Sync database agar tabel otomatis dibuat jika belum ada
        await db.sync({ alter: true });
        console.log('✅ Tables synced!');
    } catch (error) {
        console.error('❌ Database Error:', error);
    }
};

// JIKA DIJALANKAN DI LAPTOP (node server.js)
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running locally on http://localhost:${PORT}`);
        });
    });
} else {
    // JIKA DIJALANKAN DI VERCEL
    // Kita panggil koneksi DB, tapi jangan pakai 'await' yang memblokir export
    connectDB();
}

// WAJIB: Export 'app' supaya Vercel bisa membacanya
module.exports = app;