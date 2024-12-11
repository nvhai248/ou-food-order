import { RestApiBase } from "../configs/axios";

export async function FetchUserInfo(jwt: string) {
  try {
    const result = await RestApiBase({}, "/api/users/me", "GET", jwt);

    return result.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function Login(identifier: string, password: string) {
  try {
    const result = await RestApiBase(
      { identifier: identifier, password: password },
      "/api/auth/local",
      "POST"
    );

    return result.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
