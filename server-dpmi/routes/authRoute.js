const router = require("express").Router();
const {registerAuth,loginAuth} = require("../controller/controllerAuth")

router.post('/register', registerAuth);
router.post('/login', loginAuth);

module.exports = router;
