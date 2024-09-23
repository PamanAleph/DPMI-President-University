const router = require("express").Router();
const { getAllData, getDataById, createNewData, updateExistingData, deleteExistingData, getSetupBySlug } = require("../controller/controllerSetup");

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createNewData);
router.put("/:id", updateExistingData);
router.delete("/:id", deleteExistingData);
router.get("/:slug", getSetupBySlug);

module.exports = router;
