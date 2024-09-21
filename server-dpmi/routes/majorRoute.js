const router = require("express").Router();
const { getAllData, getDataById, createNewData, updateExistingData, deleteExistingData, getDataBySlug } = require("../controller/controller");

router.get("/", getAllData);
router.get("/:id", getDataById);
router.post("/", createNewData);
router.put("/:id", updateExistingData);
router.delete("/:id", deleteExistingData);

module.exports = router;
