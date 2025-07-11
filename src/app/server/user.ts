export interface UserProfileUpdates {
  username?: string;
  email?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface userPreferences {
  id: string,
  username: string,
  language: string,
  currency: string,
  darkMode: boolean,
  optInEmails: boolean,
}

import { Session, User } from "next-auth";
import { signOut } from "next-auth/react";
import { warnToast, successToast, failToast } from "../utils/toast";

export const getUser = async (id: string, session: any, status: string): Promise<userPreferences | undefined> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to view your notes.");
    return;
  }

  if (!id) {
    warnToast("No user id provided.")
  }

  try {
    if (!session) return;
    
    const response = await fetch(`/api/preferences/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user.");
    }

    const data: userPreferences = await response.json();
    //successToast("Envelopes loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching user:", err);
    failToast(err.message || "Error loading user.");
    return undefined;
  }
};

export const updateUserProfile = async (
  updates: UserProfileUpdates,
  session: Session | null,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }
  if (status === "unauthenticated" || !session?.user?.id) {
    failToast("Please sign in to update your profile.");
    return false;
  }
  if (Object.keys(updates).length === 0) {
    warnToast("No profile changes provided.");
    return false;
  }

  try {
    const response = await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      successToast(result.message || "Profile updated successfully!");
      if (updates.username || updates.email) {
        await signOut();
      }
      return true;
    } else {
      failToast(result.message || "Failed to update profile.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error updating profile:", error);
    failToast("An unexpected error occurred during profile update.");
    return false;
  }
};

export const changeUserPassword = async (
  data: PasswordChangeData,
  session: Session | null,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }
  if (status === "unauthenticated" || !session?.user?.id) {
    failToast("Please sign in to change your password.");
    return false;
  }
  if (!data.currentPassword || !data.newPassword) {
    warnToast("Both current and new passwords are required.");
    return false;
  }

  try {
    const response = await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      successToast(result.message || "Password updated successfully!");
      return true;
    } else {
      failToast(result.message || "Failed to change password.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error changing password:", error);
    failToast("An unexpected error occurred during password change.");
    return false;
  }
};

export const updateDarkMode = async (
  value: boolean,
  session: any,
  status: string
) => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }
  if (status === "unauthenticated" || !session?.user?.id) {
    failToast("Please sign in to update your profile.");
    return false;
  }

  const payload = {"darkMode":value}

  try {
    const response = await fetch("/api/preferences/updatepref", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const result = await response.json();

    if (response.ok) {
      //successToast(result.message || "Theme updated successfully!");
      return result.darkMode;
    } else {
      failToast(result.message || "Failed to change theme.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error changing theme:", error);
    failToast("An unexpected error occurred during theme change.");
    return false;
  }
};

export const updateEmails = async (
  value: boolean,
  session: any,
  status: string
) => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }
  if (status === "unauthenticated" || !session?.user?.id) {
    failToast("Please sign in to update your profile.");
    return false;
  }

  const payload = {"optInEmails":value}

  try {
    const response = await fetch("/api/preferences/updatepref", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const result = await response.json();

    if (response.ok) {
      //successToast(result.message || "Theme updated successfully!");
      return result.optInEmails;
    } else {
      failToast(result.message || "Failed to change email settings.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error changing email settings:", error);
    failToast("An unexpected error occurred during email settings.");
    return false;
  }
};
