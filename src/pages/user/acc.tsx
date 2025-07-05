import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import HelpPage from "@/app/components/ui/HelpPage";
import Layout from "@/app/components/ui/Layout";
import LoadingScreen from "@/app/components/ui/Loader";
import { deleteUserAccount } from "@/app/server/data";
import { updateUserProfile, UserProfileUpdates } from "@/app/server/user";
import { successToast, failToast, progressToast } from "@/app/utils/toast";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import React, { useEffect, useState } from "react";

export default function acc() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletion, setDeletion] = useState("");
  const [tab, setTab] = useState("Account");
  const [helptab, setHelpTab] = useState("Introduction")
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (session && status) {
      if (
        typeof session.user.username === "string" &&
        typeof session.user.email === "string"
      ) {
        setUsername(session.user.username);
        setEmail(session.user.email);
      }
    }
    setLoading(false);
  }, [session, status]);

  const userId = session?.user.id;

  const handleSignOut = async () => {
    try {
      const result = await signOut({ redirect: false });

      if (result) {
        successToast("You have been signed out.");
        router.push("/auth/login");
      }
    } catch (error) {
      failToast(`Error during sign out:, ${error}`);
      failToast("Failed to sign out. Please try again.");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);

    const updates: UserProfileUpdates = {};
    if (username.trim() !== (session?.user?.username || "")) {
      updates.username = username.trim();
    }
    if (email.trim() !== (session?.user?.email || "")) {
      updates.email = email.trim();
    }

    if (Object.keys(updates).length === 0) {
      successToast("No changes detected.");
      setIsProfileSaving(false);
      return;
    }

    const success = await updateUserProfile(updates, session, status);
    setIsProfileSaving(false);
    if (success) {
    }
  };

  const beginDelete = () => {
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (userId && deletion.length > 0) {
      progressToast("Commencing deletion...");
      await deleteUserAccount(userId, deletion, session, status);
      signOut();
      successToast("Your account was deleted.");
    }
  };

  const deletionInput = () => {
    return (
      <input
        id="deletion"
        name="deletion"
        type="deletion"
        required
        className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-200 my-3"
        placeholder="Password"
        value={deletion}
        onChange={(e) => setDeletion(e.target.value)}
      />
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Your Account Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {deleteModal && (
        <ConfirmModal dialogue="Are you sure you want to delete EVERYTHING? Just to be sure, enter your password:" renderInput={deletionInput} buttonOne="Confirm Deletion"
        buttonOneAction={handleDelete} buttonTwo="Cancel" buttonTwoAction={()=>{setDeleteModal(false)}}/>
      )}

      <div className="xl:m-4 relative">
        <h1 className="header">Hello, {session?.user.username}</h1>
        <aside className="md:inline hidden">
          <ul className="flex flex-nowrap justify-center -mb-px border-b border-gray-200 cursor-pointer">
            <li
              onClick={() => setTab("Account")}
              className={`acc-tabs ${
                tab === "Account" ? "bg-grey-150 rounded" : "bg-white"
              }`}
            >
              Account
            </li>
            <li
              onClick={() => setTab("Preferences")}
              className={`acc-tabs ${
                tab === "Preferences" ? "bg-grey-150 rounded" : "bg-white"
              }`}
            >
              Preferences
            </li>
            <li
              onClick={() => setTab("Actions")}
              className={`acc-tabs ${
                tab === "Actions" ? "bg-grey-150 rounded" : "bg-white"
              }`}
            >
              Actions
            </li>
            <li
              onClick={() => setTab("Help")}
              className={`acc-tabs ${
                tab === "Help" ? "bg-grey-150 rounded" : "bg-white"
              }`}
            >
              Help
            </li>
            <li
              onClick={handleSignOut}
              className="acc-tabs hover:bg-red-500"
            >
              Signout
            </li>
          </ul>
        </aside>
        <div className="flex justify-center w-full">
          {tab === "Actions" ? (
            <main className="md:w-4/5 text-center">
              <section className="my-4 w-2/3 mx-auto">
                <p>We understand the sensitivity of your personal and financial information. This section outlines our unwavering commitment to protecting your data. We collect and use your account details (like username and email) and financial data (your transactions, income, and budget allocations) solely to provide you with seamless budgeting services, personalize your experience, and improve our app's functionality.</p>
                <p>We employ robust security measures, including encryption, to safeguard your information against unauthorized access. We guarantee that your personal and financial data is never sold, rented, or shared with third parties for marketing or advertising purposes.</p>
                <p>You maintain complete control over your account. You can update your details, manage your preferences, and permanently delete your account and all associated data at any time.</p>
              </section>
              <button className="button my-6" onClick={beginDelete}>Delete Account</button>
            </main>
            ) : tab === 'Help' ? (
              <main className="grid grid-cols-4 grid-rows-10 md:w-full">
                <aside className="md:inline hidden">
                  <ul className="flex flex-col justify-start">
                    <li className="help-tabs" onClick={() => setHelpTab("Introduction")}>Introduction</li>
                    <li className="help-tabs" onClick={() => setHelpTab("Home")}>Home</li>
                    <li className="help-tabs" onClick={() => setHelpTab("Calendar")}>Calendar</li>
                    <li className="help-tabs" onClick={() => setHelpTab("Summary")}>Summary</li>
                    <li className="help-tabs" onClick={() => setHelpTab("Envelopes")}>Envelopes</li>
                    <li className="help-tabs" onClick={() => setHelpTab("Edit")}>Edit</li>
                    <li className="help-tabs" onClick={() => setHelpTab("Notes")}>Notes</li>
                  </ul>
                </aside>
                <section className="col-span-3 mt-4 px-8">
                  <HelpPage currentTab={helptab}/>
                </section>
              </main>
          ) : (
            <main className="md:w-4/5">
              <section className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Update Profile Details
                </h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isProfileSaving}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isProfileSaving}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="button bg-emerald-600 hover:bg-emerald-200"
                      disabled={isProfileSaving}
                    >
                      {isProfileSaving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              </section>
            </main>
          )}
        </div>
      </div>
    </Layout>
  );
}
