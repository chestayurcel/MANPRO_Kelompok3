const isAdmin = (req, res, next) => {
    // req.user didapat dari middleware verifyToken sebelumnya
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak! Khusus Admin.' });
    }
};

module.exports = isAdmin;