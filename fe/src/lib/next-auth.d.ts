import { User } from "@/core/type/user";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User?;
    jwt: string?;
    error: any?;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt: string | null;
    error: any?;
  }
}
