import axios from "axios";
import { API_SETUP } from "@/config/config";
import Setup from "@/models/setup";

// Fetch data function
export const fetchSetup = async (): Promise<Setup[]> => {
  try {
    const response = await axios.get<{ data: Setup[] }>(`${API_SETUP}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching setups:", error);
    return [];
  }
};

export const createSetup = async (
  setupData: Omit<Setup, "id" | "create_at" | "major_name">
): Promise<Setup[]> => {
  try {
    const response = await axios.post<{ data: Setup[] }>(
      `${API_SETUP}`,
      setupData,
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

export const updateSetup = async (setupData: Setup): Promise<Setup[]> => {
  try {
    const response = await axios.put<{ data: Setup[] }>(
      `${API_SETUP}/${setupData.id}`,
      setupData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating setup:", error);
    throw error;
  }
};

export const deleteSetup = async (setupId: number): Promise<Setup[]> => {
  try {
    const response = await axios.delete<{ data: Setup[] }>(
      `${API_SETUP}/${setupId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting setup:", error);
    throw error;
  }
};

export const fetchSetupById = async (setupId: number): Promise<Setup> => {
  try {
    const response = await axios.get<{ data: Setup }>(
      `${API_SETUP}/setup/${setupId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching setup by id:", error);
    throw error;
  }
};

export const fetchSetupBySlug = async (slug: string): Promise<Setup> => {
  try {
    const response = await axios.get<{ data: Setup }>(`${API_SETUP}/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching setup by slug:", error);
    throw error;
  }
};
