const { client } = require("../config/db");

const findAll = async () => {
  try {
    const result = await client.query("SELECT * FROM roles");
    return result.rows;
  } catch (err) {
    console.error("Internal server error:", err);
  }
};

const findById = async (id) => {
  try {
    const result = await client.query("SELECT * FROM roles WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  const { name, description } = data;
  try {
    const result = await client.query(
      "INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const updateData = async (id, data) => {
  const { name, description } = data;
  try {
    const result = await client.query(
      "UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const result = await client.query("DELETE FROM roles WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
};
