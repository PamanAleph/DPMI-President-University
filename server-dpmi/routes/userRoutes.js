const router = require("express").Router();
const {
  fetchAllUsers,
  fetchUserById,
  modifyUser,
  removeUser,
} = require("../controller/controllerUser");

router.get("/", fetchAllUsers);
router.get("/id/:id", fetchUserById);
router.put("/:id", modifyUser);
router.delete("/:id", removeUser);

module.exports = router;
