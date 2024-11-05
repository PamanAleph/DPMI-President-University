const {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  checkExistingEvaluation,
  evaluationsDataWithSetup,
  findEvaluationsByMajor
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
  const { id } = req.params;
  try {
    await deleteData(id);
    res.json({
      response: {
        status: "success",
        message: "Data deleted successfully",
      },
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

const checkingExistingEvaluation = async (req, res) => {
  const { setupId, majorIds, semester, endDate } = req.body;

  if (!Array.isArray(majorIds) || majorIds.length === 0) {
    return res.status(400).json({
      response: {
        status: "error",
        message: "majorIds must be a non-empty array.",
      },
      data: null,
    });
  }

  try {
    const dataExists = await checkExistingEvaluation(
      setupId,
      majorIds,
      semester,
      endDate
    );

    if (dataExists) {
      return res.status(409).json({
        response: {
          status: "error",
          message: "An evaluation with the exact same content already exists.",
        },
        data: null,
      });
    }

    res.json({
      response: {
        status: "success",
        message: "Data existence check completed successfully",
      },
      data: false,
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

const evaluationData = async(req,res) => {
  try {
    const data = await evaluationsDataWithSetup();
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
}

const getEvaluationsByMajor = async (req, res) => {
  const { majorId } = req.params;
  
  try {
    const evaluations = await findEvaluationsByMajor(majorId);
    
    if (evaluations.length === 0) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "No evaluations found for the specified major",
        },
        data: null,
      });
    }

    res.json({
      response: {
        status: "success",
        message: "Evaluations fetched successfully",
      },
      data: evaluations,
    });
  } catch (error) {
    console.error("Error fetching evaluations by major:", error);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: error.message,
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
  checkingExistingEvaluation,
  evaluationData,
  getEvaluationsByMajor
};
