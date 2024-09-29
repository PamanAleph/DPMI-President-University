const { login, register } = require("../service/serviceAuth");

const registerAuth = async (req, res) => {
  const { email, password, username, major_id, role_id } = req.body;

  try {
    const user = await register(
      email,
      password,
      username,
      parseInt(major_id, 10),
      parseInt(role_id, 10)
    );
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginAuth = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerAuth, loginAuth };
