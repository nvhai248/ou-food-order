import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SERVER_BASE_URL } from "./constants";

export const MyApolloClient = new ApolloClient({
  uri: `${SERVER_BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});
