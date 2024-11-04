const {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  fetchQuestionsById
} = require("../service/serviceQuestions");

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

const updateDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await updateData(id, req.body);
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

const deleteDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteData(id);
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

const getQuestionsById = async (req, res) => {
  const { setupId } = req.params;
  try {
    const data = await fetchQuestionsById(setupId);
    if (!data || data.length === 0) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "No questions found for the given setup ID",
        },
        data: null,
      });
    }
    res.json({
      response: {
        status: "success",
        message: "Questions fetched successfully",
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
  createNewData,
  updateDataById,
  deleteDataById,
  getQuestionsById
};