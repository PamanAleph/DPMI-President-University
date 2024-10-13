const { client } = require("../config/db");

const findAll = async () => {
  try {
    const result = await client.query("SELECT * FROM answers");
    return result.rows;
  } catch (error) {
    console.error("Internal server error:", error);
    throw new Error("Failed to fetch answers data");
  }
};

const findById = async (id) => {
  try {
    const result = await client.query("SELECT * FROM answers WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      throw new Error("Answer not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Internal server error:", error);
    throw new Error("Failed to fetch answer data");
  }
};

module.exports = {
  findAll,
  findById,
};
