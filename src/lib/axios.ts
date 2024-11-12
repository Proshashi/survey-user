import { envConfigs } from "@/configs/env";
import axios from "axios";

const apiClient = axios.create({
  baseURL: envConfigs.apiEndpoint,
});

export function setAuthTokenToHeader(token: string) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function removeAuthTokenFromHeader() {
  delete apiClient.defaults.headers.common["Authorization"];
}

export default apiClient;
