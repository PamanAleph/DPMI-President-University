import { API_SECTION } from "@/config/config";
import Sections from "@/models/section";
import axios from "axios";

export const getSections = async () => {
  try {
    const response = await axios.get<{ data: Sections[] }>(`${API_SECTION}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching setups:", error);
    return [];
  }
};

export const getSection = async (id: string) => {
  try {
    const response = await axios.get(`${API_SECTION}/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createSection = async (sections: Omit<Sections, "id" | "questions">[]) => {
  try {
    const response = await axios.post(API_SECTION, sections);
    return response.data;
  } catch (error) {
    console.error("Failed to create sections:", error);
    throw error;
  }
};

export const updateSection = async (id: number, section: Sections) => {
  try {
    const response = await axios.put(`${API_SECTION}/${id}`, section);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteSection = async (id: string) => {
  try {
    const response = await axios.delete(`${API_SECTION}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
