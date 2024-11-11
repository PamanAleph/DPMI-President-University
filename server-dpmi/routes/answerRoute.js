const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  getAllData,
  getDataById,
  createAnswer,
  getAnswersByEvaluationId,
  updateAnswerData,
  updateScoreData,
} = require("../controller/controllerAnswer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedExtensions = ["pdf", "zip", "rar"];
      const fileExtension = file.originalname.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return cb(new Error("Only PDF, ZIP, and RAR files are allowed"));
      }
      cb(null, true);
    },
  });

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createAnswer);
router.get("/evaluation/:evaluationId", getAnswersByEvaluationId);
router.put("/batch-update", upload.any(), updateAnswerData);
router.put("/update-score", updateScoreData);

module.exports = router;
