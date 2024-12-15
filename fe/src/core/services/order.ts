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
