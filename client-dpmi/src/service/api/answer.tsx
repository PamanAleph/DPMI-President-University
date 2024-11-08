import { API_ANSWER } from "@/config/config";
import Answer from "@/models/answer";
import axios from "axios";

export async function fetchAnswers(evaluationId: number): Promise<Answer[]> {
  try {
    const response = await axios.get(
      `${API_ANSWER}/evaluation/${evaluationId}`
    );
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
  answers: Array<{ id: number; answer: string; score: number }>
): Promise<void> {
  try {
    const response = await axios.put(`${API_ANSWER}/batch-update`, { answers });
    console.log("Batch update response:", response.data);
  } catch (error) {
    console.error("Error updating answers:", error);
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
