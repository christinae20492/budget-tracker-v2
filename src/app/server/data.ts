import { Envelope, Expense, Income } from "@/generated/prisma";
import { warnToast, failToast, successToast } from "../utils/toast";
import { Note } from "../utils/types";

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
    successToast("Data loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching data", err);
    failToast(err.message || "Error loading data.");
    return undefined;
  }
};