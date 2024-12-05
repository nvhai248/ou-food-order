import { JWT } from "next-auth/jwt";
import { RestApiBase } from "../configs/axios";

export async function RefreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const result = await RestApiBase({}, "refreshAccessToken", "POST");

    const refreshedTokens = result.data;

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Date.now() + refreshedTokens.expires_in * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      refresh_expires_at:
        Date.now() + (refreshedTokens.refresh_expires_in ?? 0) * 1000,
    };
  } catch (error: any) {
    console.error("Error refreshing access token:", error.message);

    if (error.response) {
      console.error("Keycloak response data:", error.response.data);
      console.error("Keycloak response status:", error.response.status);
      console.error("Keycloak response headers:", error.response.headers);
    }

    return {
      access_token: "",
      expires_at: 0,
      refresh_token: "",
      refresh_expires_at: 0,
      error: "RefreshAccessTokenError",
    };
  }
}

export async function FetchUserInfo(accessToken: string) {
  try {
    const result = await RestApiBase({}, "fetch", "POST");

    return result.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function Login(email: string, password: string) {
  try {
    const result = await RestApiBase({ email, password }, "fetch", "POST");

    return result.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
