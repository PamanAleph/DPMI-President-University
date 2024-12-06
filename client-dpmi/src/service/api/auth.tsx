import { API_AUTH } from "@/config/config";
import axios, { AxiosResponse } from "axios";

interface LoginResponseData {
  accessToken: string;
  username: string;
  major_id: number;
  is_admin: boolean;
}

export async function UserLogin(
  email: string,
  password: string
): Promise<LoginResponseData> {
  try {
    const response: AxiosResponse<{
      response: {
        status: string;
        message: string;
      };
      data: LoginResponseData;
    }> = await axios.post(`${API_AUTH}/login`, { email, password });

    if (response?.data?.response?.status !== "success") {
      throw new Error(response?.data?.response?.message || "Login failed");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API error:", error.response.data);
      throw new Error(error.response.data.response?.message || "Login failed");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
}

interface AdminRegister {
  email: string;
  password: string;
  username: string;
  major_id: number;
  isAdmin: boolean;
}

export async function AdminRegister(user: AdminRegister) {
  try {
    const response = await axios.post(`${API_AUTH}/register`, user);

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
