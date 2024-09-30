const router = require("express").Router();
const {
  getAllData,
  getDataById,
  createNewData,
  updateDataById,
  deleteDataById,
} = require("../controller/controllerRole");

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createNewData);
router.put("/:id", updateDataById);
router.delete("/:id", deleteDataById);

module.exports = router;