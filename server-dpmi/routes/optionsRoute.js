const router = require("express").Router();
const { createOptions } = require("../controller/controllerOptions");

router.post("/create", createOptions);

module.exports = router;