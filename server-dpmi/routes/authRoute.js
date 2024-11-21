const router = require("express").Router();
const {register,login} = require("../controller/controllerAuth")
const {validateRegister} = require("../middleware/validateRequest")

router.post('/register', validateRegister, register);
router.post('/login', login);

module.exports = router;
