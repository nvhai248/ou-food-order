import { SERVER_BASE_URL } from "@/lib/constants";
import axios, { AxiosRequestConfig } from "axios";

export const RestApiBase = async (
  data: any,
  endPoint: string,
  method?: string,
  token?: string,
  params?: Record<string, any>
): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };

  const config: AxiosRequestConfig = {
    url: `${SERVER_BASE_URL}${endPoint}`,
    method: method ? method : "POST",
    data: data,
    params: params,
    withCredentials: true,
    headers: headers,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log("Network or other error", error.message);
    throw error;
  }
};
