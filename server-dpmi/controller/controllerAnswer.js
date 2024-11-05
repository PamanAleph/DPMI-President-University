const {
  findAll,
  findById,
  insertAnswer,
  updateAnswer,
  deleteAnswer,
  fetchAnswerByEvaluationId
} = require("../service/serviceAnswer");

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

const createAnswer = async (req, res) => {
  try {
    const { question_id, answer = null, evaluation_id, score = null } = req.body;

    if (!question_id || !evaluation_id) {
      return res.status(400).json({
        response: {
          status: "error",
          message: "Evaluation ID and question ID are required",
        },
        data: null,
      });
    }

    const newAnswer = await insertAnswer(evaluation_id, question_id, answer, score);
    res.status(201).json({
      response: {
        status: "success",
        message: "Answer created successfully",
      },
      data: newAnswer,
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

const updateAnswerData = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_id, answer } = req.body;

    if (!question_id || !answer) {
      return res.status(400).json({
        response: {
          status: "error",
          message: "Question ID and answer text are required",
        },
        data: null,
      });
    }

    const updatedAnswer = await updateAnswer(id, question_id, answer);
    res.json({
      response: {
        status: "success",
        message: "Answer updated successfully",
      },
      data: updatedAnswer,
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

// Delete an answer
const deleteAnswerData = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnswer = await deleteAnswer(id);
    res.json({
      response: {
        status: "success",
        message: "Answer deleted successfully",
      },
      data: deletedAnswer,
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

const getAnswersByEvaluationId = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const answers = await fetchAnswerByEvaluationId(evaluationId);

    if (!answers.length) {
      res.status(404).json({
        response: {
          status: "error",
          message: "No answers found for this evaluation ID",
        },
        data: null,
      });
    } else {
      res.json({
        response: {
          status: "success",
          message: "Answers fetched successfully",
        },
        data: answers,
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
  createAnswer,
  updateAnswerData,
  deleteAnswerData,
  getAnswersByEvaluationId
};
