import { MyApolloClient } from "@/lib/apolo";
import { GraphQLError } from "graphql";
import { QueryBatches } from "../definegql/queries";
import { BasePagingRequest } from "../type";
import { RestApiBase } from "../configs/axios";

export async function GetBatchesService(
  accessToken: string,
  pagination: BasePagingRequest,
  sort?: string[]
): Promise<any> {
  try {
    const { data, errors } = await MyApolloClient.query({
      query: QueryBatches,
      variables: { pagination: pagination, sort: sort },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    if (errors) {
      return {
        data: null,
        errors: errors.map((error: any) => new GraphQLError(error.message)),
      };
    }

    return {
      data: data || null,
      errors: null,
    };
  } catch (error: any) {
    return {
      data: null,
      errors: [
        new GraphQLError(
          error.message || "An error occurred during clear cart."
        ),
      ],
    };
  }
}

export async function CreateNewBatchService(name: string, jwt: string) {
  try {
    const result = await RestApiBase(
      {
        data: {
          name: name,
          state: "open",
          locale: "vi",
        },
      },
      "/api/batches",
      "POST",
      jwt
    );

    return result.data;
  } catch (error) {
    return error;
  }
}
