const validateRegister = (req, res, next) => {
    const { email, username, password, major_id, is_admin } = req.body;
  
    if (!email || !username || !password || major_id === undefined) {
      return res.status(400).json({ message: "Invalid request body" });
    }
  
    next();
  };
  
  module.exports = { validateRegister };
  