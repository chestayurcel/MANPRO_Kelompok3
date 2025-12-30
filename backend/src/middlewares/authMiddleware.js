const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Ambil token dari header (Biasanya format: "Bearer <token>")
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak tersedia.' });
    }

    // Buang kata "Bearer " agar sisa kode tokennya saja
    const token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Format token salah.' });
    }

    // 2. Verifikasi token dengan kunci rahasia
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
        }
        
        // 3. Jika oke, simpan data user (id, role) ke dalam request
        req.user = decoded;
        next(); // Lanjut ke Controller
    });
};

module.exports = verifyToken;