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

const insertAnswer = async (evaluationId, questionId, answer = null, score = null) => {
  try {
    const query = `
      INSERT INTO answers (evaluation_id, question_id, answer, score)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [evaluationId, questionId, answer, score];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting answer:", error);
    throw new Error("Failed to insert answer data");
  }
};

const updateAnswer = async (id, answerText, score) => {
  try {
    const query = `
      UPDATE answers
      SET answer = $1, score = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [answerText, score, id];
    
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

const fetchAnswerByEvaluationId = async (evaluationId) => {
  try {
    const query = `
      SELECT * FROM answers
      WHERE evaluation_id = $1;
    `;
    const values = [evaluationId];

    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Internal server error:", error);
    throw new Error("Failed to fetch answer data");
  }
};

module.exports = {
  findAll,
  findById,
  insertAnswer,
  updateAnswer,
  deleteAnswer,
  fetchAnswerByEvaluationId
};