import { API_AUTH } from "@/config/config";
import Users from "@/models/users";
import axios from "axios";

export async function Login(username: string, password: string) {
  try {
    const response = await axios.post(`${API_AUTH}/login`, {
      username,
      password,
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function Register(user: Users) {
  try {
    const response = await axios.post(`${API_AUTH}/register`, user);

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
