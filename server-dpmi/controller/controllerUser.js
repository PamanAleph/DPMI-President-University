const {
  findAll,
  findById,
  updateUser,
  deleteUser,
} = require("../service/serviceUser");

const getAllData = async (req, res) => {
  try {
    const data = await findAll();

    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
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

const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findById(id);
    if (!data) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    }
    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
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

const updateData = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const data = await updateUser(id, updates);
    res.json({
      response: {
        status: "success",
        message: "Data updated successfully",
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

const deleteData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteUser(id);
    res.json({
      response: {
        status: "success",
        message: "Data deleted successfully",
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
  getAllData,
  getDataById,
  updateData,
  deleteData,
};
