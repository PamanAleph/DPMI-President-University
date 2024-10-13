const { client } = require("../config/db"); // Assuming you are using a PostgreSQL client like pg or knex

const findAll = async () => {
  try {
    const evaluationsQuery = 'SELECT * FROM evaluations';
    const { rows: evaluationsData } = await client.query(evaluationsQuery);

    const evaluationsWithMajorAndSetupNames = await Promise.all(
      evaluationsData.map(async (evaluation) => {
        let majorIds = [];

        if (Array.isArray(evaluation.major_id)) {
          majorIds = evaluation.major_id;
        } else if (typeof evaluation.major_id === "string") {
          majorIds = evaluation.major_id.split(",").map((id) => id.trim());
        }

        // Fetch major names based on major_ids
        const majorQuery = `
          SELECT name FROM major WHERE id = ANY($1::int[])
        `;
        const { rows: majorData } = await client.query(majorQuery, [majorIds]);
        const majorNames = majorData.map((major) => major.major_name);

        // Fetch setup name based on setup_id
        const setupQuery = `
          SELECT name FROM setup WHERE id = $1 LIMIT 1
        `;
        const { rows: setupData } = await client.query(setupQuery, [evaluation.setup_id]);
        const setupName = setupData[0] ? setupData[0].name : null;

        return {
          ...evaluation,
          major_names: majorNames,
          setup_name: setupName,
        };
      })
    );

    return evaluationsWithMajorAndSetupNames;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const evaluationQuery = 'SELECT * FROM evaluations WHERE id = $1 LIMIT 1';
    const { rows: evaluationData } = await client.query(evaluationQuery, [id]);

    if (!evaluationData.length) {
      return null;
    }

    const evaluation = evaluationData[0];
    let majorIds = [];

    if (Array.isArray(evaluation.major_id)) {
      majorIds = evaluation.major_id;
    } else if (typeof evaluation.major_id === "string") {
      majorIds = evaluation.major_id.split(",").map((id) => id.trim());
    }

    const majorQuery = `
      SELECT name FROM major WHERE id = ANY($1::int[])
    `;
    const { rows: majorData } = await client.query(majorQuery, [majorIds]);
    const majorNames = majorData.map((major) => major.major_name);

    const setupQuery = 'SELECT * FROM setup WHERE id = $1 LIMIT 1';
    const { rows: setupData } = await client.query(setupQuery, [evaluation.setup_id]);

    return {
      ...evaluation,
      major_names: majorNames,
      setup: setupData[0] || null,
    };
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  try {
    const insertQuery = `
      INSERT INTO evaluations (setup_id, major_id, semester, end_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [data.setup_id, data.major_id, data.semester, data.end_date];
    const { rows: createdData } = await client.query(insertQuery, values);

    return createdData[0];
  } catch (err) {
    console.log(err);
  }
};

const updateData = async (id, data) => {
  try {
    const updateQuery = `
      UPDATE evaluations
      SET setup_id = $1, major_id = $2, semester = $3, end_date = $4
      WHERE id = $5
      RETURNING *
    `;
    const values = [data.setup_id, data.major_id, data.semester, data.end_date, id];
    const { rows: updatedData } = await client.query(updateQuery, values);

    return updatedData[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const deleteQuery = 'DELETE FROM evaluations WHERE id = $1 RETURNING *';
    const { rows: deletedData } = await client.query(deleteQuery, [id]);

    return deletedData[0];
  } catch (err) {
    console.log(err);
  }
};

const checkExistingEvaluation = async (setupId, majorIds, semester, endDate) => {
  if (!Array.isArray(majorIds) || majorIds.length === 0) {
    throw new Error("Invalid majorIds");
  }

  const checkQuery = `
    SELECT * FROM evaluations
    WHERE setup_id = $1 AND semester = $2 AND end_date = $3 AND major_id @> $4::int[]
  `;
  const { rows: existingEvaluations } = await client.query(checkQuery, [setupId, semester, endDate, majorIds]);

  const existingEvaluation = existingEvaluations.find((evaluation) => {
    return (
      evaluation.setup_id === setupId &&
      JSON.stringify(evaluation.major_id) === JSON.stringify(majorIds) &&
      evaluation.semester === semester &&
      evaluation.end_date === endDate
    );
  });

  return !!existingEvaluation;
};

const evaluationsDataWithSetup = async () => {
  try {
    const evaluationsQuery = 'SELECT * FROM evaluations';
    const { rows: evaluationsData } = await client.query(evaluationsQuery);

    const evaluationsWithMajorNames = await Promise.all(
      evaluationsData.map(async (evaluation) => {
        let majorIds = [];

        if (Array.isArray(evaluation.major_id)) {
          majorIds = evaluation.major_id;
        } else if (typeof evaluation.major_id === "string") {
          majorIds = evaluation.major_id.split(",").map((id) => id.trim());
        }

        const majorQuery = `
          SELECT name FROM major WHERE id = ANY($1::int[])
        `;
        const { rows: majorData } = await client.query(majorQuery, [majorIds]);
        const majorNames = majorData.map((major) => major.major_name);

        const setupQuery = 'SELECT * FROM setup WHERE id = $1 LIMIT 1';
        const { rows: setupData } = await client.query(setupQuery, [evaluation.setup_id]);

        return {
          ...evaluation,
          major_names: majorNames,
          setup: setupData[0] || null,
        };
      })
    );

    return evaluationsWithMajorNames;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  checkExistingEvaluation,
  evaluationsDataWithSetup,
};
