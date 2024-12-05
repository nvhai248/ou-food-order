"use client";

import { MyApolloClient } from "@/lib/apolo";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

const MyProvider = ({ children }: Props) => {
  return (
    <ApolloProvider client={MyApolloClient}>
      <SessionProvider>{children}</SessionProvider>
    </ApolloProvider>
  );
};

export default MyProvider;
