import apiClient from "./axios";

export interface UserAuth {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function authenticateUser(credentials: LoginCredentials) {
  try {
    console.log({ credentials });
    const response = await apiClient.post("/auth/user/login", credentials);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Authentication failed");
  }
}
