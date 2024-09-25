import { API_SECTION } from "@/config/config";
import axios from "axios";

export const getSections = async () => {
  try {
    const response = await axios.get(API_SECTION);
    return response.data;
  } catch (error) {
    console.error(error);
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

export const createSection = async (section: unknown) => {
  try {
    const response = await axios.post(API_SECTION, section);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateSection = async (id: string, section: unknown) => {
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
