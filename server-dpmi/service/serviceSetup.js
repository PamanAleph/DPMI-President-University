const { client } = require("../config/db");

// Find all setup data with sections and questions
const findAllSetup = async () => {
  try {
    const setupData = await client.query("SELECT * FROM setup");

    const setupWithSections = await Promise.all(
      setupData.rows.map(async (setup) => {
        const sectionData = await client.query(
          "SELECT id, section_name, sequence FROM sections WHERE setup_id = $1",
          [setup.id]
        );

        const sectionsWithQuestions = await Promise.all(
          sectionData.rows.map(async (section) => {
            const questionData = await client.query(
              "SELECT question FROM questions WHERE section_id = $1",
              [section.id]
            );
            return {
              ...section,
              questions: questionData.rows.map((question) => ({
                id: question.question,
                
              })),
            };
          })
        );

        return {
          ...setup,
          sections: sectionsWithQuestions,
        };
      })
    );

    return setupWithSections;
  } catch (err) {
    console.error("Error fetching setup data:", err);
    throw err;
  }
};

// Find setup data by ID
const findSetupById = async (id) => {
  try {
    const setupData = await client.query("SELECT * FROM setup WHERE id = $1", [id]);

    if (setupData.rowCount === 0) {
      return null;
    }

    const sectionData = await client.query(
      "SELECT id, section_name, sequence FROM sections WHERE setup_id = $1",
      [setupData.rows[0].id]
    );

    const sectionsWithQuestions = await Promise.all(
      sectionData.rows.map(async (section) => {
        const questionData = await client.query(
          "SELECT id, type, question_description, parent_id, sequence FROM questions WHERE section_id = $1",
          [section.id]
        );

        return {
          ...section,
          questions: questionData.rows.map((question) => ({
            id: question.id,
            type: question.question_type,
            question_description: question.question_description,
            parent_id: question.parent_id,
            sequence: question.sequence,
          })),
        };
      })
    );

    return {
      ...setupData.rows[0],
      sections: sectionsWithQuestions,
    };
  } catch (err) {
    console.error("Error fetching setup by ID:", err);
    throw err;
  }
};

// Create setup data
const createData = async (data) => {
  try {
    const queryText = "INSERT INTO setup (name, slug) VALUES ($1, $2) RETURNING *"; 
    const createdData = await client.query(queryText, [data.name, data.slug]); 
    return createdData.rows[0];
  } catch (err) {
    console.error("Error creating setup data:", err);
    throw err;
  }
};

// Update setup data
const updateData = async (id, data) => {
  try {
    const queryText = "UPDATE setup SET name = $1, slug = $2 WHERE id = $3 RETURNING *"; // Adjust columns
    const updatedData = await client.query(queryText, [data.name, data.slug, id]);
    return updatedData.rows[0];
  } catch (err) {
    console.error("Error updating setup data:", err);
    throw err;
  }
};

// Delete setup data
const deleteData = async (id) => {
  try {
    const deletedData = await client.query("DELETE FROM setup WHERE id = $1 RETURNING *", [id]);
    return deletedData.rows[0];
  } catch (err) {
    console.error("Error deleting setup data:", err);
    throw err;
  }
};

// Find setup by slug with related sections and questions
const findBySlug = async (slug) => {
  try {
    const setupData = await client.query("SELECT * FROM setup WHERE slug = $1", [slug]);

    if (setupData.rowCount === 0) {
      throw new Error(`Setup not found for slug: ${slug}`);
    }

    const setup = setupData.rows[0];

    // Fetch sections related to the setup
    const sectionData = await client.query(
      "SELECT id, section_name, sequence FROM sections WHERE setup_id = $1",
      [setup.id]
    );

    const sectionsWithQuestions = await Promise.all(
      sectionData.rows.map(async (section) => {
        const questionData = await client.query(
          "SELECT * FROM questions WHERE section_id = $1",
          [section.id]
        );
        
        const questions = questionData.rows.map((question) => ({
          id: question.id,
          parent_id: question.parent_id,
          sequence: question.sequence,
          question: question.question,
          type: question.type,

         
        }));

        return {
          id: section.id,
          name: section.section_name,
          sequence: section.sequence,
          questions: questions,
        };
      })
    );

    return {
        id: setup.id,
        name: setup.name,
        create_at: setup.create_at,
        slug: setup.slug,
        sections: sectionsWithQuestions,
    };
  } catch (error) {
    console.error("Error in findBySlug:", error.message);
    throw new Error("Failed to fetch setup by slug");
  }
};


// Get all setup data with major names
const getAllDataWithMajorName = async () => {
  try {
    const setupData = await client.query("SELECT * FROM setup");

    const setupWithMajorNames = await Promise.all(
      setupData.rows.map(async (setup) => {
        const majorData = await client.query(
          "SELECT major_name FROM major WHERE id = ANY($1::int[])",
          [setup.major_id] // assuming major_id is an array of IDs
        );

        return {
          ...setup,
          major_name: majorData.rows.map((major) => major.major_name),
        };
      })
    );

    return setupWithMajorNames;
  } catch (err) {
    console.error("Error fetching setup data with major names:", err);
    throw err;
  }
};

module.exports = {
  findAllSetup,
  findSetupById,
  createData,
  updateData,
  deleteData,
  findBySlug,
  getAllDataWithMajorName,
};
