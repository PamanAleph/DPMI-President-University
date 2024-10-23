const { client } = require("../config/db");

const findAll = async () => {
  try {
    const result = await client.query("SELECT * FROM sections");
    return result.rows;
  } catch (err) {
    console.error("Internal server error:", err);
  }
};

const findById = async (id) => {
  try {
    const result = await client.query("SELECT * FROM sections WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  const { setup_id, name, sequence } = data;
  try {
    if (!setup_id) {
      throw new Error("setup_id is null or undefined");
    }
    const result = await client.query(
      "INSERT INTO sections (setup_id, name, sequence) VALUES ($1, $2, $3) RETURNING *",
      [setup_id, name, sequence]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error in createData:", err);
    throw err;
  }
};

const updateData = async (id, data) => {
  const { name, slug, description } = data;
  try {
    const result = await client.query(
      "UPDATE sections SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, slug, description, id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const result = await client.query(
      "DELETE FROM sections WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const findBySlug = async (slug) => {
  try {
    const result = await client.query(
      "SELECT * FROM sections WHERE slug = $1",
      [slug]
    );
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
  findBySlug,
};
