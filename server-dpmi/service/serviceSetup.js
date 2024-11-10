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
        sec.name AS section_name,
        sec.sequence AS section_sequence,
        q.id AS question_id,
        q.type AS question_type,
        q.question AS question_description,
        q.parent_id AS question_parent_id,
        q.sequence AS question_sequence,
        o.id AS option_id,
        o.option AS option_text,
        o.score AS option_score,
        o.sequence AS option_sequence
      FROM setup s
      LEFT JOIN sections sec ON s.id = sec.setup_id
      LEFT JOIN questions q ON sec.id = q.section_id
      LEFT JOIN options o ON q.id = o.question_id
      WHERE s.id = $1
      ORDER BY sec.sequence, q.sequence, o.sequence
    `, [id]);

    if (setupData.rowCount === 0) {
      return null;
    }

    const result = {
      id: setupData.rows[0].setup_id,
      name: setupData.rows[0].setup_name,
      slug: setupData.rows[0].setup_slug,
      sections: []
    };

    const sectionMap = new Map();
    const questionMap = new Map();

    setupData.rows.forEach(row => {
      // Group sections
      if (!sectionMap.has(row.section_id) && row.section_id) {
        sectionMap.set(row.section_id, {
          id: row.section_id,
          name: row.section_name,
          sequence: row.section_sequence,
          questions: []
        });
        result.sections.push(sectionMap.get(row.section_id));
      }

      // Group questions within sections
      if (row.question_id) {
        if (!questionMap.has(row.question_id)) {
          questionMap.set(row.question_id, {
            id: row.question_id,
            type: row.question_type,
            question: row.question_description,
            parent_id: row.question_parent_id,
            sequence: row.question_sequence,
            options: []
          });
          sectionMap.get(row.section_id).questions.push(questionMap.get(row.question_id));
        }

        // Add options to questions if available
        if (row.option_id) {
          questionMap.get(row.question_id).options.push({
            id: row.option_id,
            option: row.option_text,
            score: row.option_score,
            sequence: row.option_sequence
          });
        }
      }
    });

    return result; // Return the structure directly

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
    const query = `
      SELECT 
        s.id AS setup_id, 
        s.name AS setup_name, 
        s.create_at AS setup_create_at, 
        s.slug AS setup_slug, 
        sec.id AS section_id, 
        sec.name AS section_name, 
        sec.sequence AS section_sequence, 
        q.id AS question_id, 
        q.parent_id AS question_parent_id, 
        q.sequence AS question_sequence, 
        q.question AS question_text, 
        q.type AS question_type,
        o.id AS option_id,
        o.option AS option_text,
        o.score AS option_score,
        o.sequence AS option_sequence
      FROM setup s
      LEFT JOIN sections sec ON sec.setup_id = s.id
      LEFT JOIN questions q ON q.section_id = sec.id
      LEFT JOIN options o ON o.question_id = q.id
      WHERE s.slug = $1
      ORDER BY sec.sequence, q.sequence, o.sequence;
    `;

    const result = await client.query(query, [slug]);

    if (result.rowCount === 0) {
      throw new Error(`Setup not found for slug: ${slug}`);
    }

    const setupData = result.rows[0];

    const sectionsMap = new Map();
    const questionsMap = new Map();

    result.rows.forEach((row) => {
      // Process sections
      if (!sectionsMap.has(row.section_id)) {
        sectionsMap.set(row.section_id, {
          id: row.section_id,
          name: row.section_name,
          sequence: row.section_sequence,
          questions: [],
        });
      }

      // Process questions
      if (row.question_id) {
        if (!questionsMap.has(row.question_id)) {
          questionsMap.set(row.question_id, {
            id: row.question_id,
            parent_id: row.question_parent_id,
            sequence: row.question_sequence,
            question: row.question_text,
            type: row.question_type,
            options: [],
          });
          sectionsMap.get(row.section_id).questions.push(questionsMap.get(row.question_id));
        }

        if (row.option_id) {
          questionsMap.get(row.question_id).options.push({
            id: row.option_id,
            option: row.option_text,
            score: row.option_score,
            sequence: row.option_sequence,
          });
        }
      }
    });

    const sections = Array.from(sectionsMap.values());

    // Return the setup object with nested sections, questions, and options
    return {
      id: setupData.setup_id,
      name: setupData.setup_name,
      create_at: setupData.setup_create_at,
      slug: setupData.setup_slug,
      sections: sections,
    };
  } catch (error) {
    console.error("Error in findBySlug:", error.message);
    throw new Error("Failed to fetch setup by slug");
  }
};



// Get all setup data with major names
const getAllDataWithMajorName = async () => {
  try {
    // Raw SQL query to fetch setup data with major names using JOIN and UNNEST
    const query = `
      SELECT 
        s.*, 
        ARRAY_AGG(m.major_name) AS major_names
      FROM 
        setup s
      LEFT JOIN 
        major m ON m.id = ANY(s.major_id)
      GROUP BY 
        s.id
    `;

    const result = await client.query(query);

    // Return the setup data with major names
    return result.rows;
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
