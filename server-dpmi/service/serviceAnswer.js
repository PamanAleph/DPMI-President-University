const { supabase } = require("../common/common");

const findAll = async () => {
  try {
    const { data: answersData, error: answersError } = await supabase
      .from("answers")
      .select("*");

    if (answersError) {
      console.error("Error fetching answers data:", answersError);
      throw new Error("Failed to fetch answers data");
    }

    return answersData;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const { data: answerData, error: answerError } = await supabase
      .from("answers")
      .select("*")
      .eq("id", id)
      .single();

    if (answerError) {
      console.log(answerError);
      throw new Error("Failed to fetch answer data");
    }

    return answerData;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
};
