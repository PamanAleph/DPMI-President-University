require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { Pool } = require("pg");

const app = express();
const port = 4000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize PostgreSQL client
const pool = new Pool({
  connectionString: process.env.SUPABASE_URL, // Supabase provides a direct connection URL for PostgreSQL
});

app.use(express.json());

// Test PostgreSQL connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connected to PostgreSQL!", time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({
      error: "Failed to connect to PostgreSQL",
      details: error.message,
    });
  }
});

// Test Supabase client
app.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("major").select("*");

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch data", details: error.message });
  }

  res.json(data);
});

app.get("/test-setup", async (req, res) => {
  const { data, error } = await supabase.from("setup").select("*");
  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch data", details: error.message });
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
