import { API_EVALUATION } from "@/config/config";
import Evaluation from "@/models/evaluation";
import axios from "axios";

export const fetchEvaluations = async () => {
  try {
    const response = await axios.get<{ data: Evaluation[] }>(
      `${API_EVALUATION}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return [];
  }
};

export const createEvaluation = async (
  evaluationData: Omit<Evaluation, "id">
): Promise<Evaluation[]> => {
  try {
    const response = await axios.post<{ data: Evaluation[] }>(
      `${API_EVALUATION}`,
      evaluationData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating setup:", error);
    throw error;
  }
};

export const updateEvaluation = async (
  evaluationData: Omit<Evaluation, "major_names" | "setup_name">
) => {
  try {
    const response = await axios.put<{ data: Evaluation[] }>(
      `${API_EVALUATION}/${evaluationData.id}`,
      evaluationData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating evaluation:", error);
    throw error;
  }
};

export const deleteEvaluation = async (
  evaluationId: number
): Promise<Evaluation[]> => {
  try {
    const response = await axios.delete<{ data: Evaluation[] }>(
      `${API_EVALUATION}/${evaluationId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    throw error;
  }
};
