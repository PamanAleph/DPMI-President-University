const { findAll, findById, createData, updateData, deleteData,  findBySlug} = require("../service/serviceSections");

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
    const sections = req.body;
    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({
        response: {
          status: "error",
          message: "No sections provided",
        },
        data: null,
      });
    }
    const createdSections = [];
    for (const section of sections) {
      const { setup_id, name, sequence } = section;
      if (!setup_id || !name || !sequence) {
        return res.status(400).json({
          response: {
            status: "error",
            message: "Invalid section data",
          },
          data: null,
        });
      }
      const createdSection = await createData(section);
      createdSections.push(createdSection);
    }
    res.status(201).json({
      response: {
        status: "success",
        message: "Sections created successfully",
      },
      data: createdSections,
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
  const { id } = req.params;
  try {
    const data = await updateData(id, req.body);
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

const deleteExistingData = async (req, res) => {
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

const getSectionsBySlug = async (req, res) =>{
  const {slug} = req.params;
  try {
    const data = await findBySlug(slug);
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
}

module.exports = { getAllData, getDataById, createNewData, updateExistingData, deleteExistingData, getSectionsBySlug};
