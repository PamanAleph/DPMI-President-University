import { API_COUNT } from "@/config/config";
import axios from "axios";

interface CountsData {
  users: number;
  evaluations: number;
  major: number;
  setup: number;
}

export const fetchCounts = async (): Promise<CountsData> => {
  try {
    const response = await axios.get<CountsData>(`${API_COUNT}/counts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching counts:", error);
    throw new Error("Failed to fetch counts");
  }
};
