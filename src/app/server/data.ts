
import { warnToast, failToast, successToast, progressToast } from "../utils/toast";
import { Envelope, Expense, Income, Note } from "../utils/types";

interface Data {
    expenses: Expense[],
    envelopes: Envelope[],
    incomes: Income[]
}

export const getAllData = async (session: any, status: string): Promise<Data | undefined> => {
    
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to view your notes.");
    return;
  }

  try {
    if (!session) return;
    
    const response = await fetch("/api/data");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data.");
    }

    const data: Data = await response.json();
    //successToast("Data loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching data", err);
    failToast(err.message || "Error loading data.");
    return undefined;
  }
};

export const deleteUserAccount = async (
  userId: string,
  password: string,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading" || status === "unauthenticated" || !session?.user?.id) {
    warnToast("Authentication required to delete account.");
    return false;
  }

  if (session.user.id !== userId) {
      warnToast("Authorization error: Cannot delete another user's account.");
      return false;
  }

  if (!password) {
    warnToast("Please enter your password to confirm account deletion.");
    return false;
  }

  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      progressToast(result.message || 'Account deleted successfully.');
      return true;
    } else {
      failToast(result.message || 'Failed to delete account.');
      return false;
    }
  } catch (error) {
    console.error("Client-side error deleting account:", error);
    failToast("An unexpected error occurred during account deletion.");
    return false;
  }
};