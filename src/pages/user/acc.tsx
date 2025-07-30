import Changelog from "@/app/components/ui/Changelog";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import HelpPage from "@/app/components/ui/HelpPage";
import Layout from "@/app/components/ui/Layout";
import LoadingScreen from "@/app/components/ui/Loader";
import { deleteUserAccount } from "@/app/server/data";
import {
  getUser,
  updateDarkMode,
  updateEmails,
  updateUserProfile,
  userPreferences,
  UserProfileUpdates,
} from "@/app/server/user";
import { successToast, failToast, progressToast } from "@/app/utils/toast";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import React, { useEffect, useState } from "react";

export default function UserAccount() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletion, setDeletion] = useState("");
  const [tab, setTab] = useState("Account");
  const [showTabs, setShowTabs] = useState(false);
  const [helptab, setHelpTab] = useState("Introduction");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEmails, setIsEmails] = useState(false);
  const [userDetails, setUserDetails] = useState<userPreferences | null>(null);

  useEffect(() => {
    setLoading(true);

    if (status === "loading") {
      return;
    }

    if (!session && status === "unauthenticated") {
      signIn();
      setLoading(false);
    }

    if (session && status) {
      fetchUserAndSetState(session.user.id);
      if (
        typeof session.user.username === "string" &&
        typeof session.user.email === "string"
      ) {
        setUsername(session.user.username);
        setEmail(session.user.email);
        if (userDetails) {
          setIsDarkMode(userDetails.darkMode);
          setIsEmails(userDetails.optInEmails);
        }
      }
    }
    setLoading(false);
  }, [session, status]);

  const fetchUserAndSetState = async (id: string) => {
    setLoading(true);

    const user = await getUser(id, session, status);
    if (!user) return;

    setUserDetails(user);
    if (!userDetails) {
      return;
    }
    setLoading(false);
  };

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

    if (type) {
      updates.type = type;
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
    if (userDetails?.id && deletion.length > 0) {
      progressToast("Commencing deletion...");
      await deleteUserAccount(userDetails.id, deletion, session, status);
      signOut();
      successToast("Your account was deleted.");
    }
  };

  const handleThemeToggle = async (value: boolean) => {
    setLoading(true);
    console.log("Attempting to set dark mode to:", value);
    try {
      const result = await updateDarkMode(value, session, status);
      console.log(result);
      if (!userDetails) return;
      await fetchUserAndSetState(userDetails.id);
      //successToast(`Theme updated to ${value ? 'dark' : 'light'} mode.`);
      setIsDarkMode(result);
    } catch (error) {
      failToast("Failed to update theme preference.");
      console.error("Theme update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailToggle = async (value: boolean) => {
    setLoading(true);
    console.log("Attempting to set emails mode to:", value);
    try {
      const result = await updateEmails(value, session, status);
      if (!userDetails) return;
      await fetchUserAndSetState(userDetails.id);
      //successToast(`Emails updated to ${value ? 'refuse' : 'receive'}.`);
      setIsEmails(result);
    } catch (error) {
      failToast("Failed to update email preference.");
      console.error("Email update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const setMobileTab = (tab: string) =>{
    setTab(tab);
    setMobileMenu(false);
  }

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
        <ConfirmModal
          dialogue="Are you sure you want to delete EVERYTHING? Just to be sure, enter your password:"
          renderInput={deletionInput}
          buttonOne="Confirm Deletion"
          buttonOneAction={handleDelete}
          buttonTwo="Cancel"
          buttonTwoAction={() => {
            setDeleteModal(false);
          }}
        />
      )}

      {mobileMenu && (
        <div className="w-full h-full">
        <ul className="flex flex-col justify-center -mb-px border-b-2 border-gray-200 dark:border-gray-500 cursor-pointer">
            <li
              onClick={() => setMobileTab("Account")}
              className={`acc-tabs ${
                tab === "Account"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Account
            </li>
            <li
              onClick={() => setMobileTab("Preferences")}
              className={`acc-tabs ${
                tab === "Preferences"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Preferences
            </li>
            <li
              onClick={() => setMobileTab("Actions")}
              className={`acc-tabs ${
                tab === "Actions"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Actions
            </li>
            <li
              onClick={() => setMobileTab("Updates")}
              className={`acc-tabs ${
                tab === "Updates"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Updates
            </li>
            <li
              onClick={() => setMobileTab("Help")}
              className={`acc-tabs ${
                tab === "Help"
                  ? "bg-grey-150 rounded hover:bg-inherit dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Help
            </li>
            <li
              onClick={handleSignOut}
              className="acc-tabs hover:bg-red-500 dark:hover:bg-red-800"
            >
              Signout
            </li>
          </ul>
          </div>
      )}

      <div className="xl:m-4 relative">
        <h1 className="header">Hello, {session?.user.username}</h1>
        <aside className="inline overflow-auto overflow-y-hidden w-full mx-auto">
          <span onClick={()=>{setMobileMenu(!mobileMenu)}} className="md:invisible visible px-6 py-2 border border-grey-150 rounded ml-3">{mobileMenu ? "Close Menu" : "Open Menu"}</span>
          <ul className="flex flex-nowrap justify-center -mb-px border-b border-gray-200 dark:border-gray-500 cursor-pointer md:visible invisible">
            <li
              onClick={() => setTab("Account")}
              className={`acc-tabs ${
                tab === "Account"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Account
            </li>
            <li
              onClick={() => setTab("Preferences")}
              className={`acc-tabs ${
                tab === "Preferences"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Preferences
            </li>
            <li
              onClick={() => setTab("Actions")}
              className={`acc-tabs ${
                tab === "Actions"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Actions
            </li>
            <li
              onClick={() => setTab("Updates")}
              className={`acc-tabs ${
                tab === "Updates"
                  ? "bg-grey-150 rounded dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Updates
            </li>
            <li
              onClick={() => setTab("Help")}
              className={`acc-tabs ${
                tab === "Help"
                  ? "bg-grey-150 rounded hover:bg-inherit dark:bg-black dark:text-white"
                  : "bg-white dark:bg-grey-400"
              }`}
            >
              Help
            </li>
            <li
              onClick={handleSignOut}
              className="acc-tabs hover:bg-red-500 dark:hover:bg-red-800"
            >
              Signout
            </li>
          </ul>
        </aside>
        <div className="flex justify-center w-full">
          {tab === "Actions" ? (
            <main className="md:w-4/5 text-center dark:bg-grey-500">
              <section className="my-4 w-2/3 mx-auto">
                <p>
                  We understand the sensitivity of your personal and financial
                  information. This section outlines our unwavering commitment
                  to protecting your data. We collect and use your account
                  details (like username and email) and financial data (your
                  transactions, income, and budget allocations) solely to
                  provide you with seamless budgeting services, personalize your
                  experience, and improve our app's functionality.
                </p>
                <p>
                  We employ robust security measures, including encryption, to
                  safeguard your information against unauthorized access. We
                  guarantee that your personal and financial data is never sold,
                  rented, or shared with third parties for marketing or
                  advertising purposes.
                </p>
                <p>
                  You maintain complete control over your account. You can
                  update your details, manage your preferences, and permanently
                  delete your account and all associated data at any time.
                </p>
              </section>
              <button className="button my-6" onClick={beginDelete}>
                Delete Account
              </button>
            </main>
          ) : tab === "Updates" ? (
            <main className="md:w-3/5 md:mx-0 mx-3 dark:bg-grey-500">
              <p className="text-center text-grey-300">
                **Emails can potentially be sent to your Spam/Junk folder. Keep
                an eye out!
              </p>

              <Changelog />
            </main>
          ) : tab === "Preferences" ? (
            <main className="md:w-4/5 dark:bg-grey-500">
              <h2 className="text-2xl font-semibold my-4 text-center">
                User Preferences
              </h2>
              <section className="mx-auto block md:w-2/3 w-full">
                <div className="pref-div">
                  <h3 className="block text-gray-800 dark:text-gray-100 text-lg font-semibold mb-3">
                    Theme Preference:
                  </h3>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="theme-light"
                        name="theme"
                        value="light"
                        checked={!isDarkMode}
                        onChange={() => handleThemeToggle(false)}
                        disabled={loading}
                        className="radio-btn"
                      />
                      <label htmlFor="theme-light" className="radio-btn-label">
                        Light Mode
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="theme-dark"
                        name="theme"
                        value="dark"
                        checked={isDarkMode}
                        onChange={() => handleThemeToggle(true)}
                        disabled={loading}
                        className="radio-btn"
                      />
                      <label htmlFor="theme-dark" className="radio-btn-label">
                        Dark Mode
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pref-div">
                  <h3 className="block text-gray-800 dark:text-gray-100 text-lg font-semibold mb-3">
                    Email Subscriptions:
                  </h3>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="email-subscribe"
                        name="emails"
                        value="subscribe"
                        checked={isEmails}
                        onChange={() => handleEmailToggle(true)}
                        disabled={loading}
                        className="form-radio h-5 w-5 text-green-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-green-500 transition duration-150 ease-in-out cursor-pointer"
                      />
                      <label
                        htmlFor="email-subscribe"
                        className="radio-btn-label"
                      >
                        Yes, subscribe to optional emails
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="email-unsubscribe"
                        name="emails"
                        value="unsubscribe"
                        checked={!isEmails}
                        onChange={() => handleEmailToggle(false)}
                        disabled={loading}
                        className="form-radio h-5 w-5 text-red-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-red-500 transition duration-150 ease-in-out cursor-pointer"
                      />
                      <label
                        htmlFor="email-unsubscribe"
                        className="radio-btn-label"
                      >
                        No, unsubscribe from optional emails
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          ) : tab === "Help" ? (
            <main className="grid md:grid-cols-4 grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-10 md:w-full dark:bg-grey-500">
              <aside className="md:inline block">
                <ul className="flex md:flex-col md:row-span-7 row-span-1 md:overflow-auto overflow-x-scroll flex-row justify-start">
                  <li
                    className="help-tabs"
                    onClick={() => setHelpTab("Introduction")}
                  >
                    Introduction
                  </li>
                  <li className="help-tabs" onClick={() => setHelpTab("Home")}>
                    Home
                  </li>
                  <li
                    className="help-tabs"
                    onClick={() => setHelpTab("Calendar")}
                  >
                    Calendar
                  </li>
                  <li
                    className="help-tabs"
                    onClick={() => setHelpTab("Summary")}
                  >
                    Summary
                  </li>
                  <li
                    className="help-tabs"
                    onClick={() => setHelpTab("Envelopes")}
                  >
                    Envelopes
                  </li>
                  <li className="help-tabs" onClick={() => setHelpTab("Edit")}>
                    Edit
                  </li>
                  <li className="help-tabs" onClick={() => setHelpTab("Notes")}>
                    Notes
                  </li>
                </ul>
              </aside>
              <section className="md:col-span-3 col-span-full mt-4 px-8">
                <HelpPage currentTab={helptab} />
              </section>
            </main>
          ) : (
            <main className="md:w-4/5">
              <section className="mb-8 p-6 bg-white dark:bg-grey-500 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Update Profile Details
                </h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="text-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isProfileSaving}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="text-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isProfileSaving}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="profileType"
                      className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    >
                      Change Profile Type:
                    </label>
                    <select
                      id="profileType"
                      name="profileType"
                      value={type}
                      onChange={(e) =>
                        setType(
                          e.target.value
                        )
                      }
                      disabled={isProfileSaving}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="" disabled></option>
                      <option value="Personal">Personal</option>
                      <option value="Business">Business</option>
                      <option value="Shared">Shared</option>
                    </select>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="button bg-emerald-900 hover:bg-emerald-600"
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
