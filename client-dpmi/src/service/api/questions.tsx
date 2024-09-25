import { API_QUESTION } from "@/config/config";
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

export const createQuestion = async (question: unknown) => {
  try {
    const response = await axios.post(API_QUESTION, question);
    return response.data;
  } catch (error) {
    console.error(error);
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
