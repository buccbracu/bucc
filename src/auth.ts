import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/dbConnect";
import UserAuth from "./model/UserAuth";
import { authConfig } from "./auth.config";
import MemberInfo from "./model/MemberInfo";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { name: "email", type: "email" },
        password: { name: "password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();

        if (!credentials || typeof credentials.password !== "string") {
          throw new Error("Invalid credentials");
        }

        try {
          const user = await UserAuth.findOne({
            email: credentials.email,
          });
          if (!user) {
            console.error("User not found");
            return null;
          }

          const isPasswordCorrect = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            console.error("Invalid password");
            return null;
          }

          return user;
        } catch (error: any) {
          console.error("Error in authorize function:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session }) {
      await dbConnect();
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.designation = token.designation as string;
        session.user.buccDepartment = token.buccDepartment as string;
      }
      return session;
    },
    async jwt({ token }) {
      await dbConnect();
      if (!token.sub) return token;
      const user = await MemberInfo.findById(token.sub);
      if (!user) return token;
      token.designation = user.designation;
      token.buccDepartment = user.buccDepartment;
      return token;
    },
  },
});
