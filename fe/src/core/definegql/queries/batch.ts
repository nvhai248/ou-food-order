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

export const QueryBatchByDocumentId = gql`
  query Batch($documentId: ID!) {
    batch(documentId: $documentId) {
      name
      shipper
      state
      orders {
        note
        quantity
        createdAt
        food {
          documentId
          name
          price
        }
        documentId
      }
    }
  }
`;

// query Batch($documentId: ID!) {
//   batch(documentId: $documentId) {
//     name
//     orders {
//       note
//       quantity
//       createdAt
//       food {
//         name
//         price
//       }
//       documentId
//       user {
//         name
//         avatar {
//           url
//         }
//       }
//     }
//   }
// }
