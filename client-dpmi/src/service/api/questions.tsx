import { API_QUESTION } from "@/config/config";
import Questions from "@/models/questions";
import axios from "axios";

export const getQuestions = async () => {
  try {
    const response = await axios.get(API_QUESTION);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getQuestionById = async (id: string) => {
  try {
    const response = await axios.get(`${API_QUESTION}/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createQuestion = async (
  questionData: Omit<Questions, "id"> 
): Promise<Questions[]> => {
  try {
    const response = await axios.post<{ data: Questions[] }>(
      `${API_QUESTION}`,
      questionData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const updateQuestion = async (id: string, question: unknown) => {
  try {
    const response = await axios.put(`${API_QUESTION}/${id}`, question);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};


