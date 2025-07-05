import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { successToast, failToast } from "@/app/utils/toast";
import "@/app/tailwind.css";
import Head from "next/head";

const SignInPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      const callbackUrl = router.query.callbackUrl
        ? String(router.query.callbackUrl)
        : "/";
      router.push(callbackUrl);
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!usernameOrEmail || !password) {
      failToast("Please enter both username/email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        usernameOrEmail,
        password,
        callbackUrl: "/",
      });

      if (result?.error) {
        failToast("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        router.push(result.url || "/");
      }
    } catch (error) {
      console.error("An unexpected error occurred during sign-in:", error);
      failToast("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Welcome to Just A Bit!</title>
        <link rel="icon" href="@/app/public/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-blue-pale p-4">
        <div className="max-w-md w-full bg-white border-2 border-grey-600 p-8 rounded-xl shadow-2xl space-y-6 transform transition-all duration-300 hover:scale-105">
          <div>
            <h2 className="header font-extrabold text-gray-900 text-center mb-2">
              Welcome Back!
            </h2>
            <p className="text-center text-sm text-gray-600">
              Sign in to access your expenses.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username-email" className="sr-only">
                Username or Email
              </label>
              <input
                id="username-email"
                name="username-email"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-cobalt focus:border-blue-cobalt sm:text-base transition duration-200"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-cobalt focus:border-cobalt-500 sm:text-base transition duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-blue hover:bg-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royalBlue-800 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="register"
              className="font-medium hover:text-blue-600 hover:underline transition duration-200"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
