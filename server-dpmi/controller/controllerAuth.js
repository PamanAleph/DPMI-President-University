const { registerUser, loginUser, checkUserExists } = require("../service/serviceAuth");

const register = async (req, res) => {
  try {

    const { email, username, password, major_id, is_admin } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const newUser = await registerUser({ email, username, password, major_id, is_admin });

    res.status(201).json({
      response: {
        status: "success",
        message: "Register successfully",
      },
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        response: {
          status: "error",
          message: "Missing email or password",
        },
        data: null,
      });
    }

    // Perform login
    const data = await loginUser(email, password);

    if (!data) {
      return res.status(401).json({
        response: {
          status: "error",
          message: "Invalid email or password",
        },
        data: null,
      });
    }

    // Return success response
    res.status(200).json({
      response: {
        status: "success",
        message: "Login successful",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

module.exports = { register, login };
