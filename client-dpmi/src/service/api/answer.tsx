import { API_ANSWER } from "@/config/config";
import Answer from "@/models/answer";
import axios from "axios";

export async function fetchAnswers(evaluationId: number): Promise<Answer[]> {
  try {
    const response = await axios.get(`${API_ANSWER}/evaluation/${evaluationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
}

export async function createAnswer(answerData: Answer): Promise<Answer> {
  try {
    const response = await axios.post(`${API_ANSWER}`, answerData);
    return response.data;
  } catch (error) {
    console.error("Error creating answer:", error);
    throw error;
  }
}

export async function updateAnswer(
  id: number,
  answerText: string,
  score: number
): Promise<Answer> {
  try {
    const response = await axios.put(`${API_ANSWER}/id/${id}`, {
      answer: answerText,
      score: score,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating answer:", error);
    throw error;
  }
}

export async function deleteAnswer(answerId: number): Promise<void> {
  try {
    await axios.delete(`${API_ANSWER}/${answerId}`);
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
}
