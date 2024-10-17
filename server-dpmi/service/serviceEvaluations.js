const { client } = require("../config/db");

const findAll = async () => {
  try {
    const evaluationsQuery = `
      SELECT e.*, 
             m.name AS major_name, 
             s.name AS setup_name
      FROM evaluations e
      LEFT JOIN major m ON e.major_id = m.id
      LEFT JOIN setup s ON e.setup_id = s.id
    `;

    const { rows: evaluationsWithMajorAndSetupNames } = await client.query(
      evaluationsQuery
    );

    return evaluationsWithMajorAndSetupNames.map((evaluation) => ({
      ...evaluation,
      major_name: evaluation.major_name || null,
      setup_name: evaluation.setup_name || null,
    }));
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const evaluationQuery = `
      SELECT e.*, m.name AS major_name, s.*, 
        sec.id AS section_id,
        json_agg(json_build_object(
          'id', q.id, 
          'section_id', q.section_id, 
          'question', q.question, 
          'type', q.type, 
          'parent_id', q.parent_id, 
          'sequence', q.sequence
        )) AS questions
      FROM evaluations e
      LEFT JOIN major m ON e.major_id = m.id
      LEFT JOIN setup s ON e.setup_id = s.id
      LEFT JOIN sections sec ON s.id = sec.setup_id
      LEFT JOIN questions q ON sec.id = q.section_id
      WHERE e.id = $1
      GROUP BY e.id, m.name, s.id, sec.id
      ORDER BY sec.sequence
      LIMIT 1;
    `;

    const { rows: evaluationData } = await client.query(evaluationQuery, [id]);

    if (!evaluationData.length) {
      return null;
    }

    const evaluation = evaluationData[0];

    return {
      id: evaluation.id,
      setup_id: evaluation.setup_id,
      semester: evaluation.semester,
      end_date: evaluation.end_date,
      major_id: evaluation.major_id,
      major_name: evaluation.major_name,
      setup: {
        id: evaluation.setup_id,
        name: evaluation.name,
        create_at: evaluation.create_at,
        slug: evaluation.slug,
        sections: evaluation.questions
          ? evaluation.questions.reduce((acc, question) => {
              let section = acc.find((sec) => sec.id === question.section_id);
              if (!section) {
                section = {
                  id: question.section_id,
                  setup_id: evaluation.setup_id,
                  name: `Section ${question.sequence}`,
                  sequence: question.sequence,
                  questions: [],
                };
                acc.push(section);
              }
              section.questions.push(question);
              return acc;
            }, [])
          : [],
      },
    };
  } catch (err) {
    console.error("Error fetching evaluation by ID:", err);
    throw new Error(`Could not fetch evaluation with ID ${id}: ${err.message}`);
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
    const values = [
      data.setup_id,
      data.major_id,
      data.semester,
      data.end_date,
      id,
    ];
    const { rows: updatedData } = await client.query(updateQuery, values);
    return updatedData[0];
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const deleteQuery = "DELETE FROM evaluations WHERE id = $1 RETURNING *";
    const { rows: deletedData } = await client.query(deleteQuery, [id]);
    return deletedData[0];
  } catch (err) {
    console.log(err);
  }
};

const checkExistingEvaluation = async (
  setupId,
  majorIds,
  semester,
  endDate
) => {
  if (!Array.isArray(majorIds) || majorIds.length === 0) {
    throw new Error("Invalid majorIds");
  }

  const checkQuery = `
    SELECT * FROM evaluations
    WHERE setup_id = $1 AND semester = $2 AND end_date = $3 AND major_id = $4
  `;

  const { rows: existingEvaluations } = await client.query(checkQuery, [
    setupId,
    semester,
    endDate,
    majorIds[0],
  ]); 

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
    const evaluationsQuery = `
      SELECT e.*, 
             ARRAY_AGG(m.name) AS major_names,
             s.* 
      FROM evaluations e
      LEFT JOIN unnest(e.major_id) AS major_id ON true
      LEFT JOIN major m ON m.id = major_id::int
      LEFT JOIN setup s ON e.setup_id = s.id
      GROUP BY e.id, s.id
    `;

    const { rows: evaluationsWithSetup } = await client.query(evaluationsQuery);

    return evaluationsWithSetup.map((evaluation) => ({
      ...evaluation,
      setup: {
        id: evaluation.setup_id,
        name: evaluation.name,
        create_at: evaluation.create_at,
        slug: evaluation.slug,
      },
    }));
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
