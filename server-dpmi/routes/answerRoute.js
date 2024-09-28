const router = require("express").Router();
const {getAllData,getDataById} = require("../controller/controllerAnswer")

router.get("/", getAllData);
router.get("/id/:id", getDataById);

module.exports = router;