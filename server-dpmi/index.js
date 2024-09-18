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

// Test Supabase client
app.get("/major-list", async (req, res) => {
  try {
    const { data, error } = await supabase.from("major").select("*");

    if (error) {
      return res.status(500).json({
        response: {
          status: "error",
          message: "Failed to fetch data",
          details: error.message,
        },
        data: null,
      });
    }
    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
});

app.get("/setup-data", async (req, res) => {
  try {
    const { data, error } = await supabase.from("setup").select("*");

    if (error) {
      return res.status(500).json({
        response: {
          status: "error",
          message: "Failed to fetch data",
          details: error.message,
        },
        data: null,
      });
    }

    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
