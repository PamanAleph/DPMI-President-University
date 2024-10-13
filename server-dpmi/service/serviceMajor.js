const { client } = require("../config/db");

const findAll = async () => {
  try {
    const result = await client.query("SELECT * FROM major");
    return result.rows;
  } catch (err) {
    console.error("Internal server error:", err);
  }
};

const findById = async (id) => {
  try {
    const result = await client.query("SELECT * FROM major WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  const { name, slug, description } = data; // Adjust these fields based on your table structure
  try {
    const result = await client.query(
      "INSERT INTO major (name, slug, description) VALUES ($1, $2, $3) RETURNING *",
      [name, slug, description]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const updateData = async (id, data) => {
  const { name, slug, description } = data; // Adjust these fields based on your table structure
  try {
    const result = await client.query(
      "UPDATE major SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, slug, description, id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const result = await client.query("DELETE FROM major WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const findBySlug = async (slug) => {
  try {
    const result = await client.query("SELECT * FROM major WHERE slug = $1", [slug]);
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
