import { useSession } from "next-auth/react";
import { failToast, successToast, warnToast } from "../utils/toast";
import router from "next/router";
import { EditEnvelope, EditIncome, Income } from "../utils/types";


export const getAllIncomes = async (session: any, status: string): Promise<Income[] | undefined> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to view your incomes.");
    return;
  }

  try {
    if (!session) return;

    const response = await fetch("/api/incomes");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch incomes.");
    }

    const data: Income[] = await response.json();
    //successToast("Incomes loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching incomes:", err);
    failToast(err.message || "Error loading incomes.");
    return undefined;
  }
};

export const createNewIncome = async (
  source: string,
  amount: number,
  date: string,
  savings: number,
  investments: number,
  remainder: number,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to create incomes.");
    return false;
  }

  if (!source.trim()) {
    warnToast("Source cannot be empty.");
    return false;
  }

  const incomeData = {
    source,
    amount,
    date,
    savings,
    investments,
    remainder,
  };

  try {
    const response = await fetch("/api/incomes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incomeData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      successToast(result.message || "Income created successfully!");
      return true;
    } else {
      failToast(result.message || "Failed to create income. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error creating note:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};
export const deleteIncome = async (id: string, session: any, status: string): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to delete income.");
    return false;
  }

  if (!id) {
    warnToast("Income ID is required for deletion.");
    return false;
  }

  try {
    const response = await fetch(`/api/incomes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        successToast(result.message || "Income deleted successfully!");
      } else {
        successToast("Envelope deleted successfully!");
      }
      return true;
    } else {
      const errorResult = await response.json();
      failToast(errorResult.message || "Failed to delete income. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error deleting income:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const updateIncome = async (
  id: string,
  updateData: EditIncome,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to update incomes.");
    return false;
  }

  if (!id) {
    warnToast("Incomes ID is required for update.");
    return false;
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    warnToast("No update data provided.");
    return false;
  }

  try {
    const response = await fetch(`/api/incomes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) { 
      successToast(result.message || "Income updated successfully!");
      return true; 
    } else {
      failToast(result.message || "Failed to update income. Please try again.");
      return false; 
    }
  } catch (error) {
    console.error("Client-side error updating income:", error);
    failToast("An unexpected error occurred while updating income.");
    return false;
  }
};
