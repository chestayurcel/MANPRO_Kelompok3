// Jika kamu pakai config.js / database.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nama DB dari Railway
  process.env.DB_USER,     // User dari Railway
  process.env.DB_PASSWORD, // Password dari Railway
  {
    host: process.env.DB_HOST, // Host dari Railway
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

module.exports = sequelize;