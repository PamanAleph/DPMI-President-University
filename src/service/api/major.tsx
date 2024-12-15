import axios from "axios";
import { API_MAJOR } from "@/config/config";
import Major from "@/models/major";


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
  majorData: Omit<Major, "id" | "created_at" |"emails">
): Promise<Major[]> => {
  try {
    const response = await axios.post<{ data: Major[] }>(
      `${API_MAJOR}`,
      majorData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Response from API:", response); // Log API response

    return response.data.data;
  } catch (error) {
    console.error("Error creating major:", error); // Log error details
    throw error;
  }
};


export const updateMajor = async (majorData: Major): Promise<Major> => {
  try {
    const response = await axios.put<{ data: Major }>(
      `${API_MAJOR}/${majorData.id}`, // API endpoint with ID for update
      majorData, // Data to be updated
      {
        headers: { "Content-Type": "application/json" }, // Set headers
      }
    );
    return response.data.data; // Return the updated Major object
  }catch (error) {
    console.error("Error update major:", error); // Log error details
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

