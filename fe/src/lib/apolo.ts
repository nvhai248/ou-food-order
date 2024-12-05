import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BACKEND_URL } from "./constants";

export const MyApolloClient = new ApolloClient({
  uri: `${BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
});
