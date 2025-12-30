const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                id: user.id,
                nama: user.nama,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        
        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                token, // Ini yang paling penting
                user: {
                    id: user.id,
                    nama: user.nama,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register, login };