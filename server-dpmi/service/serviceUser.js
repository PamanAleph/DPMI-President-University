const { client } = require("../common/common");

const findAll = async () => {
  try {
    const usersQuery = `SELECT id, email, username, major_id, role_id, create_at FROM users`;
    const { rows: usersData } = await client.query(usersQuery);

    const usersWithMajorAndRole = await Promise.all(
      usersData.map(async (user) => {
        const majorQuery = `SELECT major_name FROM major WHERE id = $1`;
        const { rows: majorData } = await client.query(majorQuery, [user.major_id]);

        const roleQuery = `SELECT role_name FROM roles WHERE id = $1`;
        const { rows: roleData } = await client.query(roleQuery, [user.role_id]);

        return {
          ...user,
          major_name: majorData.length > 0 ? majorData[0].major_name : null,
          role_name: roleData.length > 0 ? roleData[0].role_name : null,
        };
      })
    );

    return usersWithMajorAndRole;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const userQuery = `SELECT id, email, username, major_id, role_id, create_at FROM users WHERE id = $1`;
    const { rows: userData } = await client.query(userQuery, [id]);

    if (userData.length === 0) {
      throw new Error("User not found");
    }

    const majorQuery = `SELECT major_name FROM major WHERE id = $1`;
    const { rows: majorData } = await client.query(majorQuery, [userData[0].major_id]);

    const roleQuery = `SELECT role_name FROM roles WHERE id = $1`;
    const { rows: roleData } = await client.query(roleQuery, [userData[0].role_id]);

    return {
      ...userData[0],
      major_name: majorData.length > 0 ? majorData[0].major_name : null,
      role_name: roleData.length > 0 ? roleData[0].role_name : null,
    };
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
