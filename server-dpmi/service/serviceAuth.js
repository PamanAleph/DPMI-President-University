const bcrypt = require("bcryptjs");
const { supabase } = require("../common/common");
const jwt = require("../utils/jwt");

const register = async (email, password, username, major_id, role_id) => {
    const hashedPassword = await bcrypt.hash(password, 10);  
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword, username, major_id, role_id }]);
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  };

const login = async (email, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.generateToken(data.id);
  return { token };
};

module.exports = { register, login };
