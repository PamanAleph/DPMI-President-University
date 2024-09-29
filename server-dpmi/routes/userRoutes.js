const router = require("express").Router();
const {
  getAllData,
  getDataById,
  updateData,
  deleteData
} = require("../controller/controllerUser");

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

module.exports = router;
