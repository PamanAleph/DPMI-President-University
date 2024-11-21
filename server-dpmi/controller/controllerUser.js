const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../service/serviceUser");

const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const modifyUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, major_id, is_admin } = req.body;

  try {
    const updatedUser = await updateUser(id, { email, username, major_id, is_admin });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const removeUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUser(id);
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  fetchAllUsers,
  fetchUserById,
  modifyUser,
  removeUser,
};
