const router = require("express").Router();
const {getAllData,getDataById, createAnswer, getAnswersByEvaluationId,updateAnswerData} = require("../controller/controllerAnswer")

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createAnswer);
router.get("/evaluation/:evaluationId", getAnswersByEvaluationId);
router.put("/batch-update", updateAnswerData);



module.exports = router;