import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: any?;
    access_token: string?;
    error: any?;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string?;
    expires_at: number?;
    refresh_token: string?;
    refresh_expires_at: number?;
    error: any?;
  }
}
