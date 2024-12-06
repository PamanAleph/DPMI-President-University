const { client } = require("../common/common");

const getAllUsers = async () => {
  const query = `SELECT id, email, username, major_id, is_admin FROM users`;
  const result = await pool.query(query);
  return result.rows;
};

// Get User By ID
const getUserById = async (id) => {
  const query = `SELECT id, email, username, major_id, is_admin FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

// Update User
const updateUser = async (id, { email, username, major_id, is_admin }) => {
  const query = `
    UPDATE users 
    SET email = COALESCE($1, email), 
        username = COALESCE($2, username), 
        major_id = COALESCE($3, major_id), 
        is_admin = COALESCE($4, is_admin)
    WHERE id = $5
    RETURNING id, email, username, major_id, is_admin;
  `;
  const values = [email, username, major_id, is_admin, id];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

// Delete User
const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id, email`;
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};