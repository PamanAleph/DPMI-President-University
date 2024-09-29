const {jwt} = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ user: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };
