"use client";

import { MyApolloClient } from "@/lib/apolo";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { LoadingProvider } from "./loading";
interface Props {
  children: ReactNode;
}

const MyProvider = ({ children }: Props) => {
  return (
    <LoadingProvider>
      <ApolloProvider client={MyApolloClient}>
        <SessionProvider>{children}</SessionProvider>
      </ApolloProvider>
    </LoadingProvider>
  );
};

export default MyProvider;
