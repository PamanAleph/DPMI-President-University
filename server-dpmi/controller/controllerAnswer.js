const {
  findAll,
  findById,
  insertAnswer,
  updateAnswer,
  deleteAnswer,
  fetchAnswerByEvaluationId,
  updateScore,
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
    const {
      question_id,
      answer = null,
      evaluation_id,
      score = null,
    } = req.body;

    if (!question_id || !evaluation_id) {
      return res.status(400).json({
        response: {
          status: "error",
          message: "Evaluation ID and question ID are required",
        },
        data: null,
      });
    }

    const newAnswer = await insertAnswer(
      evaluation_id,
      question_id,
      answer,
      score
    );
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
    // Parse answer data from the request
    const answers = JSON.parse(req.body.answers || "[]").map((answer) => ({
      id: parseInt(answer.id, 10),
      answer: answer.answer,
      score: parseInt(answer.score, 10),
    }));

    // Map the uploaded files to fileAnswers with a single file for each answer
    const fileAnswers = JSON.parse(req.body.fileAnswers || "[]").map((fileAnswer) => ({
      id: parseInt(fileAnswer.id, 10),
      file: req.files.find(
        (file) => file.fieldname === `fileAnswers_${fileAnswer.id}_files_0`
      ), // Expecting a single file per answer
    }));

    // Update answers and files in the database
    const updatedAnswers = await updateAnswer(answers, fileAnswers);

    res.json({
      response: {
        status: "success",
        message: "Answers updated successfully",
      },
      data: updatedAnswers,
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

const updateScoreData = async (req, res) => {
  try {
    const { questionId, score, evaluationId } = req.body;
    const payload = Array.isArray(req.body)
      ? req.body
      : [{ questionId, score, evaluationId }];
    const invalidItem = payload.find(
      (item) =>
        item.questionId == null ||
        item.score == null ||
        item.evaluationId == null
    );

    if (invalidItem) {
      return res.status(400).json({
        response: {
          status: "error",
          message:
            "Each item must have questionId, score, and evaluationId fields",
        },
        data: null,
      });
    }
    const updatePromises = payload.map((item) =>
      updateScore(item.questionId, item.score, item.evaluationId)
    );
    const updatedScores = await Promise.all(updatePromises);

    res.json({
      response: {
        status: "success",
        message: "Scores updated successfully",
      },
      data: updatedScores,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Failed to update scores",
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
  getAnswersByEvaluationId,
  updateScoreData,
};
