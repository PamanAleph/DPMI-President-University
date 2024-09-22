import axios from "axios";
import { API_MAJOR } from "@/config/config";
import Major from "@/models/major";


// Fetch data function
export const fetchMajor = async (): Promise<Major[]> => {
  try {
    const response = await axios.get<{ data: Major[] }>(`${API_MAJOR}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching majors:", error);
    return [];
  }
};

export const createMajor = async (
  majorData: Omit<Major, "id" | "created_at" >
): Promise<Major[]> => {
  try {
    const response = await axios.post<{ data: Major[] }>(
      `${API_MAJOR}`,
      majorData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating major:", error);
    throw error;
  }
};

export const updateMajor = async (majorData: Major): Promise<Major[]> => {
  try {
    const response = await axios.put<{ data: Major[] }>(
      `${API_MAJOR}/${majorData.id}`,
      majorData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating major:", error);
    throw error;
  }
};

export const deleteMajor = async (majorId: number): Promise<Major[]> => {
  try {
    const response = await axios.delete<{ data: Major[] }>(
      `${API_MAJOR}/${majorId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting major:", error);
    throw error;
  }
};

export const findMajorBySlug = async (major_name: string): Promise<Major | null> => {
  try {
    const response = await axios.get<{ data: Major }>(`${API_MAJOR}/${major_name}`);
    if (response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching major detail by slug:", error);
    return null;
  }
};

