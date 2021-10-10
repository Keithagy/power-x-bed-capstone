const { Pool } = require('pg')

let pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = {
  ...require('./users')(pool),
}

db.initialise = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL,
      password_hash VARCHAR(100) NOT NULL
    )
  `)

}

db.clearItemsTables = async () => {
  await pool.query('DELETE FROM Items')
  await pool.query('ALTER SEQUENCE items_id_seq RESTART')
}

db.clearUsersTables = async () => {
  await pool.query('DELETE FROM Users')
  await pool.query('ALTER SEQUENCE users_id_seq RESTART')
}

db.end = async () => {
  await pool.end()
}

module.exports = db