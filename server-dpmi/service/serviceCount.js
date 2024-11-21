const { client } = require("../config/db");

const getAllCounts = async () => {
    try {
      const result = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) AS users_count,
          (SELECT COUNT(*) FROM evaluations) AS evaluations_count,
          (SELECT COUNT(*) FROM major) AS major_count,
          (SELECT COUNT(*) FROM setup) AS setup_count
      `);
  
      const counts = result.rows[0];
      return {
        users: parseInt(counts.users_count, 10),
        evaluations: parseInt(counts.evaluations_count, 10),
        major: parseInt(counts.major_count, 10),
        setup: parseInt(counts.setup_count, 10),
      };
    } catch (error) {
      console.error("Error fetching counts:", error);
      throw new Error("Unable to fetch counts from the database.");
    }
  };
module.exports = {
    getAllCounts
};