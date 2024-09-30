import { API_ROLE } from "@/config/config";
import axios from "axios";
import Role from "@/models/role";

export const fetchRole = async (): Promise<Role[]> => {
  try {
    const response = await axios.get<{ data: Role[] }>(`${API_ROLE}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

export const createRole = async (
  roleData: Omit<Role, "id">
): Promise<Role[]> => {
  try {
    const response = await axios.post<{ data: Role[] }>(
      `${API_ROLE}`,
      roleData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

export const updateRole = async (roleData: Role): Promise<Role[]> => {
  try {
    const response = await axios.put<{ data: Role[] }>(
      `${API_ROLE}/id/${roleData.id}`,
      roleData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRole = async (roleId: number): Promise<Role[]> => {
  try {
    const response = await axios.delete<{ data: Role[] }>(
      `${API_ROLE}/${roleId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};