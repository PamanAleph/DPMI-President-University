const { client } = require("../config/db");

const findAll = async () => {
  try {
    const result = await client.query("SELECT * FROM questions");
    return result.rows;
  } catch (err) {
    console.error("Internal server error:", err);
  }
};

const findById = async (id) => {
  try {
    const result = await client.query("SELECT * FROM questions WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  const { question, type, section_id,sequence,parent_id } = data;  
  try {
    const result = await client.query(
      "INSERT INTO questions (question, type, section_id, sequence, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [question, type, section_id, sequence, parent_id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const updateData = async (id, data) => {
  const { question, type, section_id } = data; 
  try {
    const result = await client.query(
      "UPDATE questions SET question = $1, type = $2, section_id = $3 WHERE id = $4 RETURNING *",
      [question, type, section_id, id]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const result = await client.query("DELETE FROM questions WHERE id = $1 RETURNING *", [id]);
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
