require("dotenv").config();
const { Client } = require("pg");

// PostgreSQL client setup
const client = new Client({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.PORT, 10),
});

// Connect to PostgreSQL
client.connect((err) => {
  console.log(process.env.HOST, process.env.USER, process.env.DATABASE)
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

// Export the PostgreSQL client
module.exports = { client };
