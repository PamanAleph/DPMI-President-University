const router = require("express").Router();
const { getCounts } = require("../controller/controllerCount");

router.get("/", getCounts);

module.exports = router;
