import { Login, FetchUserInfo } from "@/core/services/auth";
import { NEXTAUTH_SECRET } from "@/lib/constants";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "identifier" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const data = await Login(credentials.identifier, credentials.password);

        if (data?.error) {
          return null;
        }

        return {
          id: data.user.documentId,
          name: data.user.username,
          email: data.user.email,
          jwt: data.jwt,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const temp: any = {
          ...user,
        };

        token.jwt = temp?.jwt;
        token.id = temp.id;
      }

      return token;
    },

    async session({ session, token }) {
      session.jwt = token.jwt ?? null;

      try {
        const userData = await FetchUserInfo(token.jwt as string);
        session.user = userData ?? null;
        session.jwt = token.jwt;
      } catch (err) {
        console.error("Error fetching profile:", err);
        session.error = "SessionFetchError";
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export default handler;
