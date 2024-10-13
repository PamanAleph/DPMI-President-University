require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.PORT, 10),
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

module.exports = { client };
