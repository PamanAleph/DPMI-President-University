const { supabase } = require("../common/common");

const findAll = async () => {
  try {
    const { data, error } = await supabase.from("setup").select("*");
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
      .from("setup")
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
      .from("setup")
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
      .from("setup")
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
    const { data, error } = await supabase.from("setup").delete().eq("id", id);

    if (error) {
      console.log(error);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

const findBySlug = async (slug) => {
  try {
    const { data: setupData, error: setupError } = await supabase
      .from("setup")
      .select("*")
      .eq("slug", slug)
      .single();

    if (setupError) {
      console.error("Error fetching setup data:", setupError);
      return null;
    }

    const { data: majorData, error: majorError } = await supabase
      .from("major")
      .select("major_name")
      .in("id", setupData.major_id);

    if (majorError) {
      console.error("Error fetching major data:", majorError);
      return null;
    }

    setupData.major_name = majorData.map((major) => major.major_name);

    return setupData;
  } catch (err) {
    console.error("Internal server error:", err);
    throw err;
  }
};

const getAllDataWithMajorName = async () => {
  try {
    const { data: setupData, error: setupError } = await supabase
      .from("setup")
      .select("*");

    if (setupError) {
      console.error("Error fetching setup data:", setupError);
      throw new Error("Failed to fetch setup data");
    }

    const setupWithMajorNames = await Promise.all(
      setupData.map(async (setup) => {
        const { data: majorData, error: majorError } = await supabase
          .from("major")
          .select("major_name")
          .in("id", setup.major_id);

        if (majorError) {
          console.error("Error fetching major data:", majorError);
          throw new Error("Failed to fetch major data");
        }

        return {
          ...setup,
          major_name: majorData.map((major) => major.major_name),
        };
      })
    );

    return setupWithMajorNames;
  } catch (err) {
    console.error("Internal server error:", err);
    throw err;
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  findBySlug,
  getAllDataWithMajorName,
};
