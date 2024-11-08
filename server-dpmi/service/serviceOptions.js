const { client } = require("../config/db");

const createMultipleOptions = async ({ question_id, options }) => {
  if (!Array.isArray(options) || options.length === 0) {
    throw new Error("Invalid input: Options must be a non-empty array.");
  }

  const query = `
    INSERT INTO options (question_id, option, score, sequence) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;
  `;

  const promises = options.map(({ option, score, sequence }) =>
    client.query(query, [question_id, option, score, sequence])
  );

  try {
    const results = await Promise.all(promises);
    return results.map((result) => result.rows[0]);
  } catch (err) {
    console.error("Error inserting options:", err);
    throw err;
  }
};

module.exports = {
  createMultipleOptions,
};
