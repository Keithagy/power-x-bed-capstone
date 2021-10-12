const { Pool } = require('pg');

let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = {
    ...require('./users')(pool),
};

db.initialise = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL,
      password_hash VARCHAR(100) NOT NULL
    )
  `);
    await pool.query(`
  CREATE TABLE IF NOT EXISTS Lists (
    id SERIAL PRIMARY KEY,
    creator INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    FOREIGN KEY (creator) REFERENCES Users(id) ON DELETE CASCADE
  )
`);
    await pool.query(`
  CREATE TABLE IF NOT EXISTS AccessibleTo (
    listId INTEGER NOT NULL,
    accesibleTo INTEGER NOT NULL,
    FOREIGN KEY (listId) REFERENCES Lists(id) ON DELETE CASCADE,
    FOREIGN KEY (accesibleTo) REFERENCES Users(id) ON DELETE CASCADE
  )
`);
    await pool.query(`
CREATE TABLE IF NOT EXISTS Todos (
  id SERIAL PRIMARY KEY,
  parent INTEGER NOT NULL,
  topic VARCHAR(100) NOT NULL,
  body VARCHAR(100),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (parent) REFERENCES Lists(id) ON DELETE CASCADE,
)
`);
};

db.clearItemsTables = async () => {
    await pool.query('DELETE FROM Items');
    await pool.query('ALTER SEQUENCE items_id_seq RESTART');
};

db.clearUsersTables = async () => {
    await pool.query('DELETE FROM Users');
    await pool.query('ALTER SEQUENCE users_id_seq RESTART');
};

db.end = async () => {
    await pool.end();
};

module.exports = db;