const {Sequelize} = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  isProduction ? process.env.DATABASE_URL : process.env.DATABASE_URL_MYSQL, {
    dialect: isProduction ? 'postgres' : 'mysql',
  },
);

module.exports = sequelize;
