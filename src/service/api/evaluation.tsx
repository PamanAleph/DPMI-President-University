import { API_EVALUATION } from "@/config/config";
import Evaluation from "@/models/evaluation";
import EvaluationDetails from "@/models/evaluationDetails";
import { EvaluationMajor } from "@/models/EvaluationMajor";
import { getAccessToken } from "@/utils/sessionStorage";
import axios from "axios";

export const fetchEvaluations = async (accessToken: string) => {
  try {
    const response = await axios.get<{ data: Evaluation[] }>(
      `${API_EVALUATION}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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

export const fetchEvaluationById = async (
  evaluationId: number,
  accessToken: string
) => {
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

export const fetchEvaluationByMajorId = async (): Promise<
  EvaluationMajor[]
> => {
  try {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      throw new Error("User data not found in sessionStorage");
    }
    const { accessToken, major_id } = JSON.parse(userData);

    if (!accessToken || !major_id) {
      throw new Error("Missing accessToken or major_id in user data");
    }

    const response = await axios.get<{ data: EvaluationMajor[] }>(
      `${API_EVALUATION}/major`,
      {
        params: { major_id },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching evaluation by major ID:", error);
    return [];
  }
};

export const getEvaluationPage = async ({id}: {id: number}) => {
  const accessToken = getAccessToken();
  try {
    const response = await axios.get(
      `${API_EVALUATION}/check/${id}`,{
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
}