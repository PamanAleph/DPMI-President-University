const { client } = require("../config/db");

// Find all setup data with sections and questions
const findAllSetup = async () => {
  try {
    const setupData = await client.query(`
      SELECT 
        s.id AS setup_id, 
        s.name AS setup_name, 
        s.slug AS setup_slug, 
        s.create_at AS setup_create_at,
        sec.id AS section_id,
        sec.name AS section_name,
        sec.sequence AS section_sequence,
        q.id AS question_id,
        q.question AS question_text
      FROM setup s
      LEFT JOIN sections sec ON s.id = sec.setup_id
      LEFT JOIN questions q ON sec.id = q.section_id
    `);

    const setupsMap = new Map();

    setupData.rows.forEach((row) => {
      if (!setupsMap.has(row.setup_id)) {
        setupsMap.set(row.setup_id, {
          id: row.setup_id,
          name: row.setup_name,
          slug: row.setup_slug,
          create_at: row.setup_create_at,
          sections: [],
        });
      }

      const currentSetup = setupsMap.get(row.setup_id);

      let section = currentSetup.sections.find((sec) => sec.id === row.section_id);
      if (!section && row.section_id) {
        section = {
          id: row.section_id,
          name: row.section_name,
          sequence: row.section_sequence,
          questions: [],
        };
        currentSetup.sections.push(section);
      }

      if (section && row.question_id) {
        section.questions.push({
          id: row.question_id,
          question: row.question_text,
        });
      }
    });

    const setups = Array.from(setupsMap.values());
    return setups;
  } catch (err) {
    console.error("Error fetching setup data:", err);
    throw err;
  }
};

// Find setup data by ID
const findSetupById = async (id) => {
  try {
    const setupData = await client.query(`
      SELECT 
        s.id AS setup_id, 
        s.name AS setup_name, 
        s.slug AS setup_slug,
        sec.id AS section_id, 
        sec.section_name AS section_name,
        sec.sequence AS section_sequence,
        q.id AS question_id,
        q.type AS question_type,
        q.question_description AS question_description,
        q.parent_id AS question_parent_id,
        q.sequence AS question_sequence
      FROM setup s
      LEFT JOIN sections sec ON s.id = sec.setup_id
      LEFT JOIN questions q ON sec.id = q.section_id
      WHERE s.id = $1
    `, [id]);

    if (setupData.rowCount === 0) {
      return null;
    }

    const setupMap = {
      id: setupData.rows[0].setup_id,
      name: setupData.rows[0].setup_name,
      slug: setupData.rows[0].setup_slug,
      sections: []
    };

    const sectionMap = new Map();

    setupData.rows.forEach(row => {
      if (!sectionMap.has(row.section_id) && row.section_id) {
        sectionMap.set(row.section_id, {
          id: row.section_id,
          section_name: row.section_name,
          sequence: row.section_sequence,
          questions: []
        });
        setupMap.sections.push(sectionMap.get(row.section_id));
      }

      if (row.question_id) {
        sectionMap.get(row.section_id).questions.push({
          id: row.question_id,
          type: row.question_type,
          question_description: row.question_description,
          parent_id: row.question_parent_id,
          sequence: row.question_sequence
        });
      }
    });

    return setupMap;
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

// Find by slug
const findBySlug = async (slug) => {
  try {
    const setupData = await client.query("SELECT * FROM setup WHERE slug = $1", [slug]);

    if (setupData.rowCount === 0) {
      throw new Error(`Setup not found for slug: ${slug}`);
    }

    const setup = setupData.rows[0];
    const sectionData = await client.query(
      "SELECT id, name, sequence FROM sections WHERE setup_id = $1",
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
