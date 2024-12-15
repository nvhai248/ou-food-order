import { RestApiBase } from "../configs/axios";

export async function GetFoodsServices(jwt: string) {
  try {
    const result = await RestApiBase({}, "/api/foods", "GET", jwt);

    return result.data;
  } catch (error) {
    return error;
  }
}
