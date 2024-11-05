require('dotenv').config();
const pg = require('pg');

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    dialectModule: pg,
  },
};
