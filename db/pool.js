const { Pool } = require('pg');

const { DATABASE_URL, DB, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } =
  process.env;

const pool = new Pool(
  DATABASE_URL
    ? {
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: DB_HOST,
        port: DB_PORT,
        database: DB,
        user: DB_USER,
        password: DB_PASSWORD,
        ssl: {
          rejectUnauthorized: false,
        },
      }
);

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}

getPgVersion();

module.exports = pool;
