const { Pool } = require('pg');

const { DB, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: {
    require: true,
  },
});

module.exports = pool;
