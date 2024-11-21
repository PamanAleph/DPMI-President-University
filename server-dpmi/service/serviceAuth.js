const bcrypt = require("bcryptjs");
const { client } = require("../config/db");
const { generateToken } = require("../utils/jwt");

// Register User
const registerUser = async ({
  email,
  username,
  password,
  major_id,
  is_admin,
}) => {
  if (!email || !username || !password) {
    throw new Error("Email, username, and password are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (email, username, password, major_id, is_admin)
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, email, username, major_id, is_admin;
  `;
  const values = [email, username, hashedPassword, major_id, is_admin];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Database error during registration:", error);
    throw new Error("Failed to register user");
  }
};

const checkUserExists = async (email) => {
  try {
    const query = `SELECT id FROM users WHERE email = $1`;
    const result = await client.query(query, [email]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Failed to check user existence");
  }
};

const loginUser = async (email, password) => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    const token = generateToken(user.id);

    return {
      id: user.id,
      username: user.username,
      major_id: user.major_id,
      is_admin: user.is_admin,
      accessToken: token,
    };
  } catch (err) {
    console.error("Error during login:", err);
    throw new Error("Failed to login");
  }
};

module.exports = { registerUser, checkUserExists, loginUser };
