import { RestApiBase } from "../configs/axios";
import { CreateOrderType } from "../type";

export async function CreateNewOrderService(
  data: CreateOrderType,
  jwt: string
) {
  try {
    const result = await RestApiBase(
      {
        data: data,
      },
      "/api/orders",
      "POST",
      jwt
    );

    return result.data;
  } catch (error) {
    return error;
  }
}

export async function UpdateNewOrderService(
  data: CreateOrderType,
  jwt: string,
  id: string
) {
  try {
    const result = await RestApiBase(
      {
        data: data,
      },
      `/api/orders/${id}`,
      "PUT",
      jwt
    );

    return result.data;
  } catch (error) {
    return error;
  }
}

export async function DeleteOrderService(jwt: string, id: string) {
  try {
    const result = await RestApiBase({}, `/api/orders/${id}`, "DELETE", jwt);

    return result.data;
  } catch (error) {
    return error;
  }
}
