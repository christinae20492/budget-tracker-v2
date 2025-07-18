import NextAuth, {
  AuthOptions,
  User as NextAuthUser,
  Account,
  Profile,
  Session,
  JWT,
} from "next-auth";
import type { CallbacksOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/prisma";
import bcryptjs from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      image?: string | null;
      username: string;
      darkMode: boolean;
      currency: string;
      isAdmin: boolean;
      optInEmails: boolean;
      language: string;
    };
  }
  interface JWT {
    id?: string;
    username?: string | null;
    email?: string | null;
    isAdmin?: boolean;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        usernameOrEmail: {
          label: "Username or Email",
          type: "text",
          placeholder: "username or jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          console.log("No username/email or password provided for credentials login.");
          return null;
        }
        const usernameOrEmail = String(credentials.usernameOrEmail).toLowerCase();
        const password = String(credentials.password);
        try {
          let user = null;
          if (usernameOrEmail.includes('@')) {
            user = await prisma.user.findUnique({
              where: { email: usernameOrEmail },
            });
          } else {
            user = await prisma.user.findFirst({
              where: { username: usernameOrEmail },
            });
          }
          if (!user || !user.password) {
            console.log("No user found with that username/email, or password not set.");
            return null;
          }
          const isValidPassword = await bcryptjs.compare(password, user.password);
          if (!isValidPassword) {
            console.log("Invalid password for user:", usernameOrEmail);
            return null;
          }
          console.log("User authenticated successfully:", user.email);
          return {
            id: user.id,
            name: user.username || user.email,
            email: user.email,
          } as NextAuthUser;
        } catch (error) {
          console.error("Error during credentials authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username || user.name || null;
        token.email = user.email || null;

        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isAdmin: true },
          });
          token.isAdmin = dbUser?.isAdmin ?? false;
        } catch (error) {
          console.error("Error fetching isAdmin:", error);
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.username) {
        session.user.username = token.username as string;
      }
      if (token.email) {
        session.user.email = token.email as string;
      }
      if (token.isAdmin) {
      session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
