const { client } = require("../config/db");

const createOptions = async (data) => {
  const { name, value, major_id } = data;
  try {
    const result = await client.query(
      "INSERT INTO options (name, value, major_id) VALUES ($1, $2, $3) RETURNING *",
      [name, value, major_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Database insert error:", err);
    throw err;
  }
};
