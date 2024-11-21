const {
   getAllCounts
  } = require("../service/serviceCount");

  const getCounts = async (req, res) => {
    try {
      const data = await getAllCounts();
      res.json({
        response: {
          status: "success",
          message: "Counts fetched successfully",
        },
        data: data,
      });
    } catch (err) {
      console.error("Internal server error:", err);
      res.status(500).json({
        response: {
          status: "error",
          message: "Internal server error",
          details: err.message,
        },
        data: null,
      });
    }
  };

  module.exports = {
    getCounts
  };
  