const { createMultipleOptions } = require("../service/serviceOptions");

const createOptions = async (req, res) => {
  const { question_id, options } = req.body;

  if (!Array.isArray(options) || options.length === 0) {
    return res.status(400).json({
      response: {
        status: "error",
        message: "Invalid input: Options must be a non-empty array.",
      },
      data: null,
    });
  }

  try {
    const createdOptions = await createMultipleOptions({ question_id, options });

    res.status(201).json({
      response: {
        status: "success",
        message: "Options created successfully",
      },
      data: createdOptions,
    });
  } catch (err) {
    console.error("Error creating options:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Failed to create options",
      },
      data: null,
    });
  }
};

module.exports = {
  createOptions,
};
