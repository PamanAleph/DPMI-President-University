const { supabase } = require("../common/common");

const findAll = async () => {
  try {
    const { data: evaluationsData, error: evaluationsError } = await supabase
      .from("evaluations")
      .select("*");

    if (evaluationsError) {
      console.error("Error fetching evaluations data:", evaluationsError);
      throw new Error("Failed to fetch evaluations data");
    }

    const evaluationsWithMajorNames = await Promise.all(
      evaluationsData.map(async (evaluation) => {
        let majorIds = [];

        if (Array.isArray(evaluation.major_id)) {
          majorIds = evaluation.major_id;
        } else if (typeof evaluation.major_id === "string") {
          majorIds = evaluation.major_id.split(",").map((id) => id.trim());
        }

        const { data: majorData, error: majorError } = await supabase
          .from("major")
          .select("major_name")
          .in("id", majorIds);

        if (majorError) {
          console.error("Error fetching major data:", majorError);
          throw new Error("Failed to fetch major data");
        }

        const majorNames = majorData.map((major) => major.major_name);

        return {
          ...evaluation,
          major_names: majorNames,
        };
      })
    );

    return evaluationsWithMajorNames;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("evaluations")
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
      .from("evaluations")
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
      .from("evaluations")
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
      .from("evaluations")
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

module.exports = { findAll, findById, createData, updateData, deleteData };
