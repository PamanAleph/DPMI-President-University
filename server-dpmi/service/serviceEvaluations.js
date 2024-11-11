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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error("ID must be a valid integer");
    }

    const evaluationQuery = `
      SELECT 
        e.id AS evaluation_id,
        e.*, 
        m.name AS major_name, 
        s.*, 
        sec.id AS section_id, sec.name AS section_name, sec.sequence AS section_sequence,
        q.id AS question_id, q.question, q.type, q.parent_id, q.sequence AS question_sequence,
        a.id AS answer_id, a.answer, a.score, a.file_path, a.file_name,
        o.id AS option_id, o.option AS option_text, o.score AS option_score, o.sequence AS option_sequence
      FROM 
        evaluations e
      LEFT JOIN 
        major m ON e.major_id = m.id
      LEFT JOIN 
        setup s ON e.setup_id = s.id
      LEFT JOIN 
        sections sec ON s.id = sec.setup_id
      LEFT JOIN 
        questions q ON sec.id = q.section_id
      LEFT JOIN 
        answers a ON q.id = a.question_id AND a.evaluation_id = e.id
      LEFT JOIN 
        options o ON q.id = o.question_id
      WHERE 
        e.id = $1
      ORDER BY 
        sec.sequence, q.sequence, o.sequence;
    `;

    const { rows: evaluationData } = await client.query(evaluationQuery, [
      numericId,
    ]);

    if (!evaluationData.length) {
      return null;
    }

    const evaluation = evaluationData[0];
    const sectionsMap = {};

    evaluationData.forEach((row) => {
      // Group sections
      if (!sectionsMap[row.section_id]) {
        sectionsMap[row.section_id] = {
          id: row.section_id,
          setup_id: row.setup_id,
          name: row.section_name || `Section ${row.section_sequence}`,
          sequence: row.section_sequence,
          questions: [],
        };
      }

      // Group questions with answers and options
      if (row.question_id) {
        // Find or create the question object
        let question = sectionsMap[row.section_id].questions.find(
          (q) => q.id === row.question_id
        );
        
        if (!question) {
          question = {
            id: row.question_id,
            section_id: row.section_id,
            question: row.question,
            type: row.type,
            parent_id: row.parent_id,
            sequence: row.question_sequence,
            answer: row.answer_id
              ? {
                  id: row.answer_id,
                  answer: row.answer,
                  score: row.score,
                  file: row.file_path
                    ? { path: row.file_path, name: row.file_name }
                    : null
                }
              : { id: null, answer: null, score: null, file: null },
            options: [],
          };
          sectionsMap[row.section_id].questions.push(question);
        }

        // Add options to the question
        if (row.option_id) {
          question.options.push({
            id: row.option_id,
            option: row.option_text,
            score: row.option_score,
            sequence: row.option_sequence,
          });
        }
      }
    });

    const sections = Object.values(sectionsMap);

    return {
      id: evaluation.evaluation_id,
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
        sections: sections,
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
    if (typeof data.major_id !== "number") {
      throw new Error(
        `Expected major_id to be a number, but got ${typeof data.major_id}`
      );
    }

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
    console.error("Error updating data:", err);
    throw err;
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

const findEvaluationsByMajor = async (majorId) => {
  try {
    const query = `
      SELECT e.*, 
             m.name AS major_name, 
             s.name AS setup_name
      FROM evaluations e
      LEFT JOIN major m ON e.major_id = m.id
      LEFT JOIN setup s ON e.setup_id = s.id
      WHERE e.major_id = $1
    `;

    const { rows: evaluations } = await client.query(query, [majorId]);
    return evaluations;
  } catch (error) {
    console.error("Error fetching evaluations by major:", error);
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
  findEvaluationsByMajor,
};
