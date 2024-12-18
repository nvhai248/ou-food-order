import { MyApolloClient } from "@/lib/apolo";
import { GraphQLError } from "graphql";
import { QueryBatchByDocumentId, QueryBatches } from "../definegql/queries";
import { BasePagingRequest, Batch } from "../type";
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
      fetchPolicy: "no-cache",
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

export async function GetBatchByDocumentIdService(
  accessToken: string,
  documentId: string
): Promise<any> {
  try {
    const { data, errors } = await MyApolloClient.query({
      query: QueryBatchByDocumentId,
      variables: { documentId: documentId },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      fetchPolicy: "no-cache",
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

export async function UpdateBatchService(
  batch: Batch,
  jwt: string,
  id: string
) {
  try {
    const result = await RestApiBase(
      {
        data: {
          name: batch.name,
          state: batch.state,
        },
      },
      `/api/batches/${id}`,
      "PUT",
      jwt
    );

    return result.data;
  } catch (error) {
    return error;
  }
}

export async function UpdateShipperBatchService(
  note: string,
  jwt: string,
  id: string
) {
  try {
    const result = await RestApiBase(
      {
        data: {
          shipper: note,
        },
      },
      `/api/batches/${id}`,
      "PUT",
      jwt
    );

    return result.data;
  } catch (error) {
    return error;
  }
}

export async function DeleteBatchService(jwt: string, id: string) {
  try {
    const result = await RestApiBase({}, `/api/batches/${id}`, "DELETE", jwt);

    return result.data;
  } catch (error) {
    return error;
  }
}
