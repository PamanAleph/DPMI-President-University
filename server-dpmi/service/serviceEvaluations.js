const { supabase } = require("../common/common");
const { findAllSetup, findSetupById } = require("./serviceSetup");

const findAll = async () => {
  try {
    const { data: evaluationsData, error: evaluationsError } = await supabase
      .from("evaluations")
      .select("*");

    if (evaluationsError) {
      console.error("Error fetching evaluations data:", evaluationsError);
      throw new Error("Failed to fetch evaluations data");
    }

    const evaluationsWithMajorAndSetupNames = await Promise.all(
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

        const { data: setupData, error: setupError } = await supabase
          .from("setup")
          .select("name")
          .eq("id", evaluation.setup_id)
          .single();

        if (setupError) {
          console.error("Error fetching setup data:", setupError);
          throw new Error("Failed to fetch setup data");
        }

        const setupName = setupData ? setupData.name : null;

        return {
          ...evaluation,
          major_names: majorNames,
          setup_name: setupName,
        };
      })
    );

    return evaluationsWithMajorAndSetupNames;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const { data: evaluationData, error: evaluationError } = await supabase
      .from("evaluations")
      .select("*")
      .eq("id", id)
      .single();

    if (evaluationError) {
      console.log(evaluationError);
    }

    if (!evaluationData) {
      return null;
    }

    let majorIds = [];

    if (Array.isArray(evaluationData.major_id)) {
      majorIds = evaluationData.major_id;
    } else if (typeof evaluationData.major_id === "string") {
      majorIds = evaluationData.major_id.split(",").map((id) => id.trim());
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

    const setupData = await findSetupById(evaluationData.setup_id);

    return {
      ...evaluationData,
      major_names: majorNames,
      setup: setupData,
    };
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

const checkExistingEvaluation = async (
  setupId,
  majorIds,
  semester,
  endDate
) => {
  if (!Array.isArray(majorIds) || majorIds.length === 0) {
    throw new Error("Invalid majorIds");
  }

  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("setup_id", setupId)
    .eq("semester", semester)
    .eq("end_date", endDate)
    .contains("major_id", majorIds);

  if (error) {
    throw new Error(error.message);
  }

  const existingEvaluation = data.find((evaluation) => {
    return (
      evaluation.setup_id === setupId &&
      JSON.stringify(evaluation.major_id) === JSON.stringify(majorIds) &&
      evaluation.semester === semester &&
      evaluation.end_date === endDate
    );
  });

  return existingEvaluation !== undefined;
};

const evaluationsDataWithSetup = async () => {
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

        const setupData = await findAllSetup().then((setupData) => {
          return setupData.find((setup) => setup.id === evaluation.setup_id);
        });

        return {
          ...evaluation,
          major_names: majorNames,
          setup: setupData,
        };
      })
    );

    return evaluationsWithMajorNames;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  checkExistingEvaluation,
  evaluationsDataWithSetup,
};
