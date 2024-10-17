const { client } = require("../config/db"); 

const findAll = async () => {
  try {
    const evaluationsQuery = 'SELECT * FROM evaluations';
    const { rows: evaluationsData } = await client.query(evaluationsQuery);

    const evaluationsWithMajorAndSetupNames = await Promise.all(
      evaluationsData.map(async (evaluation) => {
        const majorId = evaluation.major_id;
        const majorQuery = `
          SELECT name FROM major WHERE id = $1
        `;
        const { rows: majorData } = await client.query(majorQuery, [majorId]);
        const majorName = majorData.length > 0 ? majorData[0].name : null;

        const setupQuery = `
          SELECT name FROM setup WHERE id = $1 LIMIT 1
        `;
        const { rows: setupData } = await client.query(setupQuery, [evaluation.setup_id]);
        const setupName = setupData[0] ? setupData[0].name : null;

        return {
          ...evaluation,
          major_name: majorName, 
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
    const majorId = evaluation.major_id; 
    const majorQuery = 'SELECT name FROM major WHERE id = $1';
    const { rows: majorData } = await client.query(majorQuery, [majorId]);
    const majorName = majorData.length ? majorData[0].name : null;
    const setupQuery = 'SELECT * FROM setup WHERE id = $1 LIMIT 1';
    const { rows: setupData } = await client.query(setupQuery, [evaluation.setup_id]);
    const sectionsQuery = 'SELECT * FROM sections WHERE setup_id = $1 ORDER BY sequence';
    const { rows: sectionsData } = await client.query(sectionsQuery, [evaluation.setup_id]);
    const sectionsWithQuestions = await Promise.all(
      sectionsData.map(async (section) => {
        const questionsQuery = 'SELECT * FROM questions WHERE section_id = $1 ORDER BY sequence';
        const { rows: questionsData } = await client.query(questionsQuery, [section.id]);
        
        return {
          ...section,
          questions: questionsData,
        };
      })
    );

    return {
      ...evaluation,
      major_name: majorName, 
      setup: {
        ...setupData[0], 
        sections: sectionsWithQuestions 
      },
    };
  } catch (err) {
    console.log("Error fetching evaluation by ID:", err); 
    throw err; 
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
    console.error(err);
    throw err; 
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

  // Check if the first major ID exists in the evaluations
  const checkQuery = `
    SELECT * FROM evaluations
    WHERE setup_id = $1 AND semester = $2 AND end_date = $3 AND major_id = $4
  `;

  const { rows: existingEvaluations } = await client.query(checkQuery, [setupId, semester, endDate, majorIds[0]]); // Use the first majorId

  const existingEvaluation = existingEvaluations.find((evaluation) => {
    return (
      evaluation.setup_id === setupId &&
      evaluation.semester === semester &&
      evaluation.end_date === endDate
    );
  });

  return existingEvaluation || null;
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
