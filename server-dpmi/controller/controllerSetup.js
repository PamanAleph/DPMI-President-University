const {
  findAllSetup,
  findSetupById,
  createData,
  updateData,
  deleteData,
  findBySlug,
} = require("../service/serviceSetup");

// Standard response structure
const successResponse = (res, data, message = "Operation successful") => {
  return res.status(200).json({
    response: {
      status: "success",
      message,
    },
    data,
  });
};

const errorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    response: {
      status: "error",
      message: error.message || "Internal Server Error",
    },
    data: null,
  });
};

// Fetch all data
const getAllData = async (req, res) => {
  try {
    const data = await findAllSetup();
    return successResponse(res, data, "Data fetched successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Fetch data by ID
const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findSetupById(id);
    if (!data) return errorResponse(res, new Error("Data not found"), 404);
    return successResponse(res, data, "Data fetched successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Create new data
const createNewData = async (req, res) => {
  try {
    const data = await createData(req.body);
    return successResponse(res, data, "Data created successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Update existing data
const updateExistingData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await updateData(id, req.body);
    return successResponse(res, data, "Data updated successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Delete existing data
const deleteExistingData = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteData(id);
    return successResponse(res, null, "Data deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Fetch data by slug
const getSetupBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await findBySlug(slug);
    if (!data) return errorResponse(res, new Error("Data not found"), 404);
    return successResponse(res, data, "Data fetched successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

module.exports = {
  getAllData,
  getDataById,
  createNewData,
  updateExistingData,
  deleteExistingData,
  getSetupBySlug,
};
