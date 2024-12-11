import { gql } from "@apollo/client";

export const QueryBatches = gql`
  query Batches($pagination: PaginationArg) {
    batches(pagination: $pagination) {
      documentId
      name
      state
    }
  }
`;
