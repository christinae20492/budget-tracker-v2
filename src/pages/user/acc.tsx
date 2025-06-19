import Layout from '@/app/components/ui/Layout'
import { successToast, failToast } from '@/app/utils/toast';
import { signOut, useSession } from 'next-auth/react';
import router from 'next/router';
import React from 'react'

export default function acc() {

    const { data: session, status } = useSession();

       const handleSignOut = async () => {

    try {

      const result = await signOut({ redirect: false});

      if (result) {
        successToast("You have been signed out.");
        router.push("/auth/login");
      }
    } catch (error) {
      failToast(`Error during sign out:, ${error}`);
      failToast("Failed to sign out. Please try again.");
    }
  };

  return (
    <Layout>
        <div>
            <h2>Hello, {session?.user.username}</h2>
            <div><button
      onClick={handleSignOut}
      className="button bg-crimsonRed-700"
    >
      Sign Out
    </button></div>
        </div>
    </Layout>
  )
}
