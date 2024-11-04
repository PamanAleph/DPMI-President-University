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
    const result = await client.query("SELECT * FROM questions WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  const { question, type, section_id, sequence, parent_id } = data;
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
    const result = await client.query(
      "DELETE FROM questions WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error Delete questions by setup ID:", err);
    throw new Error("Failed to fetch Delete questions");
  }
};

const fetchQuestionsById = async (setupId) => {
  try {
    const result = await client.query(
      `
      SELECT q.*
      FROM questions q
      JOIN sections s ON s.id = q.section_id
      WHERE s.setup_id = $1
      ORDER BY q.sequence
      `,
      [setupId]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching questions by setup ID:", err);
    throw new Error("Failed to fetch questions");
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  fetchQuestionsById,
};
