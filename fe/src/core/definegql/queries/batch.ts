import { gql } from "@apollo/client";

export const QueryBatches = gql`
  query Batches($sort: [String], $pagination: PaginationArg) {
    batches(sort: $sort, pagination: $pagination) {
      name
      documentId
      state
      createdAt
    }
  }
`;
