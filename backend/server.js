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

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database connected');
        
        await db.sync({ alter: true }); 
        console.log('✅ Tables created/updated successfully!');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

startServer();