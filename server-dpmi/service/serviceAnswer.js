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

const insertAnswer = async (questionId, answerText) => {
  try {
    const query = `
      INSERT INTO answers (question_id, answer)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [questionId, answerText];
    
    const result = await client.query(query, values);
    
    return result.rows[0];
  } catch (error) {
    console.error("Internal server error:", error);
    throw new Error("Failed to insert answer data");
  }
};

const updateAnswer = async (id, questionId, answerText) => {
  try {
    const query = `
      UPDATE answers
      SET question_id = $1, answer = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [questionId, answerText, id];
    
    const result = await client.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error("Answer not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Internal server error:", error);
    throw new Error("Failed to update answer data");
  }
};

// Delete an answer
const deleteAnswer = async (id) => {
  try {
    const query = `
      DELETE FROM answers
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Answer not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Internal server error:", error);
    throw new Error("Failed to delete answer data");
  }
};

module.exports = {
  findAll,
  findById,
  insertAnswer,
  updateAnswer,
  deleteAnswer
};