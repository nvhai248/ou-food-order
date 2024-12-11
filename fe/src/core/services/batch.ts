import { MyApolloClient } from "@/lib/apolo";
import { GraphQLError } from "graphql";
import { QueryBatches } from "../definegql/queries";
import { BasePagingRequest } from "../type";

export async function GetBatchesService(
  accessToken: string,
  pagination: BasePagingRequest
): Promise<any> {
  try {
    const { data, errors } = await MyApolloClient.query({
      query: QueryBatches,
      variables: { pagination: pagination },
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
