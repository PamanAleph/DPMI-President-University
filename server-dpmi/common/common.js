require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Export the Supabase client
module.exports = { supabase };
