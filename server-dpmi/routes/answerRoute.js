const router = require("express").Router();
const {getAllData,getDataById, createAnswer, getAnswersByEvaluationId} = require("../controller/controllerAnswer")

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createAnswer);
router.get("/evaluation/:evaluationId", getAnswersByEvaluationId);


module.exports = router;