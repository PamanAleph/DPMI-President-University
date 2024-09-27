const router = require("express").Router();
const { getAllData, getDataById, createNewData, updateExistingData, deleteDataById,checkingExistingEvaluation } = require("../controller/controllerEvaluations");

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createNewData);
router.put("/:id", updateExistingData);
router.delete("/:id", deleteDataById);
router.post("/check", checkingExistingEvaluation);

module.exports = router;