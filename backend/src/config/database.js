const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.railway,     // Nama DB dari Railway
  process.env.root,     // User dari Railway
  process.env.MNQynJELyjpDdBqaSezrtlJbNCMxbxCq, // Password dari Railway
  {
    host: process.env.mysql.railway.internal, // Host dari Railway
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

module.exports = sequelize;