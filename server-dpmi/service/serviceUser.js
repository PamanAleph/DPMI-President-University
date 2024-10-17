const { client } = require("../common/common");

const findAll = async () => {
  try {
    const usersQuery = `
      SELECT u.id, u.email, u.username, u.major_id, u.role_id, u.create_at, 
             m.major_name, 
             r.role_name
      FROM users u
      LEFT JOIN major m ON u.major_id = m.id
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    
    const { rows: usersData } = await client.query(usersQuery);

    return usersData;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};


const findById = async (id) => {
  try {
    const userQuery = `
      SELECT u.id, u.email, u.username, u.major_id, u.role_id, u.create_at,
             m.major_name, r.role_name
      FROM users u
      LEFT JOIN major m ON u.major_id = m.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;

    const { rows: userData } = await client.query(userQuery, [id]);

    if (userData.length === 0) {
      throw new Error("User not found");
    }

    return userData[0]; 
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};


const updateUser = async (id, updates) => {
  try {
    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(updates);

    const updateQuery = `UPDATE users SET ${updateFields} WHERE id = $${values.length + 1} RETURNING *`;
    const { rows: updatedUserData } = await client.query(updateQuery, [...values, id]);

    return updatedUserData[0];
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const deleteQuery = `DELETE FROM users WHERE id = $1`;
    await client.query(deleteQuery, [id]);

    return `User with id ${id} deleted successfully`;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  updateUser,
  deleteUser,
};
