import { Login, RefreshAccessToken, FetchUserInfo } from "@/core/services/auth";
import { NEXTAUTH_SECRET } from "@/lib/constants";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data, errors } = await Login(
          credentials.email,
          credentials.password
        );

        if (data?.login) {
          return data.login;
        }

        if (errors) {
          throw errors[0];
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token as string;
        token.idToken = account.id_token;
        token.refresh_token = account.refresh_token as string;
        token.refresh_expires_at =
          (account.refresh_expires_in as number) * 1000 + Date.now();
        token.expires_at = (account.expires_at ?? 0) * 1000;
      }

      // Check if the access token is expired and needs to be refreshed
      if (Date.now() < (token.expires_at ?? 0)) {
        return token;
      }

      // If the token has expired, attempt to refresh it
      return await RefreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error;
        session.user = null;
        return session;
      }

      try {
        const userData = await FetchUserInfo(token.access_token as string);
        session.user = userData ?? null;
        session.access_token = token.access_token;
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
