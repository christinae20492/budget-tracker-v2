import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/prisma";
import bcryptjs from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
    };
  }
  interface JWT {
    id?: string;
    username?: string | null;
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    //   maxAge: 24 * 60 * 60,
    // }),
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
            name: user.username,
            email: user.email,
            username: user.username,
            // image: user.image,
          };
        } catch (error) {
          console.error("Error during credentials authorization:", error);
          return null;
        }
      },
    }),
  ],
   session: {
    strategy: "jwt" // Top-level property
  },
  cookies: { // Top-level property
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://'),
      },
    },
  },
  callbacks: { // Top-level property
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email; // Ensure email is on token
        token.username = (user as any).username;
      }
      console.log("CALLBACK: JWT Token after processing:", token);
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string; // Ensure email is on session
      }
      console.log("CALLBACK: Session object after processing:", session);
      return session;
    },
  },
  pages: { // Top-level property
    signIn: "/auth/login",
    // error: "/auth/error", // Uncomment if you want to use a custom error page
  },
  secret: process.env.NEXTAUTH_SECRET, // Top-level property
  debug: process.env.NODE_ENV === "development", // Top-level property
};

export default NextAuth(authOptions);