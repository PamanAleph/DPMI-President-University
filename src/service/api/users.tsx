import { API_USER } from "@/config/config";
import Users from "@/models/users";
import axios from "axios";

// todo
// access_token

export async function GetUserList(accessToken: string) {
  try {
    const response = await axios.get(`${API_USER}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GetUserById(accessToken: string, userId: number) {
  try {
    const response = await axios.get(`${API_USER}/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function CreateUser(accessToken: string, user: Users) {
  try {
    const response = await axios.post(`${API_USER}`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function UpdateUser(
  userId: number,
  user: Users,
  accessToken: string
) {
  try {
    const response = await axios.put(`${API_USER}/${userId}`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function DeleteUser(userId: number, accessToken: string) {
  try {
    const response = await axios.delete(`${API_USER}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchUsersByMajor = async (majorId: number, accessToken: string) => {
  try {
    const response = await axios.get(`${API_USER}/major/${majorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
