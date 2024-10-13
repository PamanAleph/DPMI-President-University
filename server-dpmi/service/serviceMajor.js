const { client } = require("../config/db");

const findAll = async () => {
  try {
    const result = await client.query("SELECT * FROM major");
    return result.rows;
  } catch (err) {
    console.error("Internal server error:", err);
  }
};

const findById = async (id) => {
  try {
    const result = await client.query("SELECT * FROM major WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  const { name, slug, head, emails } = data; 
  try {
    const emailsString = emails.join(", ");

    const result = await client.query(
      "INSERT INTO major (name, slug, head, emails) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, slug, head, emailsString] 
    );

    return { response: result.rows[0] };  
  } catch (err) {
    console.log("Database insert error:", err); 
    throw err;
  }
};


const updateData = async (id, data) => {
  const { name, slug, head, emails } = data;
  try {
    const emailsString = emails.join(", ");

    const result = await client.query(
      "UPDATE major SET name = $1, slug = $2, head = $3, emails = $4 WHERE id = $5 RETURNING *",
      [name, slug, head, emailsString, id] 
    );

    return result.rows[0];
  } catch (err) {
    console.error("Database update error:", err);
    throw err;
  }
};

const deleteData = async (id) => {
  try {
    const result = await client.query("DELETE FROM major WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const findBySlug = async (slug) => {
  try {
    const result = await client.query("SELECT * FROM major WHERE slug = $1", [slug]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  findBySlug,
};
