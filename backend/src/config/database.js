// Jika kamu pakai config.js / database.js
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
    },
    // 👇 TAMBAHKAN BAGIAN INI 👇
    define: {
        freezeTableName: true,  // Mencegah perubahan nama tabel ke jamak (rooms -> room)
        timestamps: true        // Pastikan ini true jika tabelmu punya createdAt/updatedAt
    }
  }
);

module.exports = sequelize;
