const router = require("express").Router();
const { getSectionsBySlug } = require("../controller/controllerSections");
const { getAllData, getDataById, createNewData, updateExistingData, deleteExistingData } = require("../controller/controllerSections");

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createNewData);
router.put("/:id", updateExistingData);
router.delete("/:id", deleteExistingData);
router.get("/:slug", getSectionsBySlug);

module.exports = router;
