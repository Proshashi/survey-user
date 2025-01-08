import "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

declare module "next-auth" {
  interface Session {
    user: IUser;
    accessToken?: string;
    error?: string;
  }

  interface User extends IUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string;
    error: string;
  }
}

export type { IUser };
