const router = require("express").Router();
const {getAllData,getDataById, createAnswer} = require("../controller/controllerAnswer")

router.get("/", getAllData);
router.get("/id/:id", getDataById);
router.post("/", createAnswer);

module.exports = router;