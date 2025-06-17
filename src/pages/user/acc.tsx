"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { AuthTokens } from "@aws-amplify/auth";
import awsmobile from "@/aws-exports";
import Layout from "@/app/components/ui/Layout";
import { getCurrentUser } from "@aws-amplify/auth";
import Auth from "@/app/components/ui/Auth";
import { useEffect } from "react";
import { fetchAuthSession } from 'aws-amplify/auth'


Amplify.configure(awsmobile);


export default function AccountPage() {
  const user = getCurrentUser();

  useEffect(()=>{
    console.log(user);
  },[])

  return (
    <Layout>
      <Authenticator>
        {({ user, signOut }) => (
          <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Account Details</h1>

            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                <strong>Email:</strong> {user?.signInDetails?.loginId}
              </p>
            </div>

            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </Authenticator>
    </Layout>
  );
}
