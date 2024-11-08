import { API_OPTION } from "@/config/config";
import axios from "axios";

export const fetchOptionsByQuestionId = async (questionId: number) => {
  try {
    const response = await axios.get(
      `${API_OPTION}/options?question_id=${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching options:", error);
    throw error;
  }
};

interface OptionData {
  option: string;
  score: number;
  sequence: number;
}

interface OptionsPayload {
  question_id: number;
  options: OptionData[];
}

export const createOptions = async (optionsData: OptionsPayload) => {
  try {
    const response = await axios.post(`${API_OPTION}/create`, optionsData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating options:", error);
    throw error;
  }
};
