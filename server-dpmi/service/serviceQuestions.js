const { supabase } = require("../common/common");

const findAll = async () => {
  try {
    const { data, error } = await supabase.from("questions").select("*");
    if (error) {
      console.log(error);
    }
    return data;
  } catch (err) {
    console.error("Internal server error:", err);
  }
};

const findById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

const createData = async (data) => {
  try {
    const { data: createdData, error } = await supabase
      .from("questions")
      .insert(data);
    if (error) {
      console.log(error);
    }
    return createdData;
  } catch (err) {
    console.log(err);
  }
};

const updateData = async (id, data) => {
  try {
    const { data: updatedData, error } = await supabase
      .from("questions")
      .update(data)
      .eq("id", id);

    if (error) {
      console.log(error);
    }
    return updatedData;
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async (id) => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
};