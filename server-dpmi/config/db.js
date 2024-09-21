const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL, 
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release(); 
  }
});