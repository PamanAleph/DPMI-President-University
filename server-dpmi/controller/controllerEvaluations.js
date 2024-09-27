const {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
} = require("../service/serviceEvaluations");

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
  try {
    const id = req.params.id;
    const data = await findById(id);
    if (!data) {
      res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    } else {
      res.json({
        response: {
          status: "success",
          message: "Data fetched successfully",
        },
        data: data,
      });
    }
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

const createNewData = async (req, res) => {
  try {
    const data = await createData(req.body);
    res.status(201).json({
      response: {
        status: "success",
        message: "Data created successfully",
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

const updateExistingData = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedData = await updateData(id, data);
    if (!updatedData) {
      res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    } else {
      res.json({
        response: {
          status: "success",
          message: "Data updated successfully",
        },
        data: updatedData,
      });
    }
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

const deleteDataById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedData = await deleteData(id);
    if (!deletedData) {
      res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    } else {
      res.json({
        response: {
          status: "success",
          message: "Data deleted successfully",
        },
        data: null,
      });
    }
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
  createNewData,
  updateExistingData,
  deleteDataById,
};
