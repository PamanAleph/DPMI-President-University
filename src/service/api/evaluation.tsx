import { API_EVALUATION } from "@/config/config";
import Evaluation from "@/models/evaluation";
import EvaluationDetails from "@/models/evaluationDetails";
import axios from "axios";

export const fetchEvaluations = async (accessToken: string) => {
  try {
    const response = await axios.get<{ data: Evaluation[] }>(`${API_EVALUATION}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    throw error;
  }
};

export const createEvaluation = async (
  evaluationData: Omit<Evaluation, "major_name" | "setup_name">,
  accessToken: string
): Promise<Evaluation[]> => {
  try {
    const response = await axios.post<{ data: Evaluation[] }>(
      `${API_EVALUATION}`,
      evaluationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating setup:", error);
    throw error;
  }
};

export const updateEvaluation = async (
  evaluationData: Omit<Evaluation, "major_names" | "setup_name">,
  accessToken: string
) => {
  try {
    const response = await axios.put<{ data: Evaluation[] }>(
      `${API_EVALUATION}/${evaluationData.id}`,
      evaluationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating evaluation:", error);
    throw error;
  }
};

export const deleteEvaluation = async (
  evaluationId: number,
  accessToken: string
): Promise<Evaluation[]> => {
  try {
    const response = await axios.delete<{ data: Evaluation[] }>(
      `${API_EVALUATION}/${evaluationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting major:", error);
    throw error;
  }
};

export const checkEvaluation = async (
  {
    setupId,
    majorIds,
    semester,
    endDate,
  }: {
    setupId: number;
    majorIds: number[];
    semester: string;
    endDate: Date;
  },
  accessToken: string
): Promise<boolean> => {
  try {
    const response = await axios.post<{ data: boolean }>(
      `${API_EVALUATION}/check`,
      { setupId, majorIds, semester, endDate },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error checking evaluation:", error);
    throw error;
  }
};

export const fetchEvaluationById = async (evaluationId: number, accessToken: string) => {
  try {
    const response = await axios.get<{ data: EvaluationDetails }>(
      `${API_EVALUATION}/id/${evaluationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching evaluation by ID:", error);
    return null;
  }
};

export const fetchEvaluationByMajorId = async (major_id: number, accessToken: string) => {
  try {
    const response = await axios.get<{ data: Evaluation[] }>(
      `${API_EVALUATION}/major/${major_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching evaluation by setup ID:", error);
    return [];
  }
};
