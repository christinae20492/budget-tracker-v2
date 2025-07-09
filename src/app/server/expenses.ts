import { useSession } from "next-auth/react";
import { failToast, successToast, warnToast } from "../utils/toast";
import router from "next/router";
import { EditExpense, Expense } from "../utils/types";


export const getAllExpenses = async (session: any, status: string): Promise<Expense[] | undefined> => {
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
    
    const response = await fetch("/api/expenses");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch notes.");
    }

    const data: Expense[] = await response.json();
    //successToast("Expenses loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching expenses:", err);
    failToast(err.message || "Error loading expenses.");
    return undefined;
  }
};

interface CreateExpenseResponse {
  expense: Expense;
  message?: string;
}

export const createExpense = async (
  location: string,
  envelopeId: string,
  date: string,
  amount: string,
  comments: string,
  session: any,
  status: string
): Promise<CreateExpenseResponse | null> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return null;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to create expenses.");
    return null;
  }

  if (!location.trim()) {
    warnToast("Location and amount cannot be empty.");
    return null;
  }

  const expData = {
    location,
    envelopeId,
    date,
    comments,
    amount,
  };

  console.log(expData)

  try {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expData),
      credentials: 'include',
    });

    const result: CreateExpenseResponse = await response.json();

    if (response.ok) {
      successToast(result.message || "Expense created successfully!");
      return result;
    } else {
      const errorMessage = (result as any).error || (result as any).message || "Failed to create expense.";
      failToast(errorMessage);
      return null;
    }
    
  } catch (error) {
    console.error("Client-side error creating expense:", error);
    failToast("An unexpected error occurred. Please try again.");
    return null;
  }
};

export const deleteExpense = async (id: string, session: any, status: string): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to delete expense.");
    return false;
  }

  if (!id) {
    warnToast("Expense ID is required for deletion.");
    return false;
  }

  try {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        successToast(result.message || "Expense deleted successfully!");
      } else {
        successToast("Expense deleted successfully!");
      }
      return true;
    } else {
      const errorResult = await response.json();
      failToast(errorResult.message || "Failed to delete expense. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error deleting expense:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const updateExpense = async (
  expenseId: string,
  updateData: EditExpense,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to update expenses.");
    return false;
  }

  if (!expenseId) {
    warnToast("Expense ID is required for update.");
    return false;
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    warnToast("No update data provided.");
    return false;
  }

  try {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) { 
      successToast(result.message || "Expense updated successfully!");
      return true; 
    } else {
      failToast(result.message || "Failed to update expense. Please try again.");
      return false; 
    }
  } catch (error) {
    console.error("Client-side error updating expense:", error);
    failToast("An unexpected error occurred while updating note.");
    return false;
  }
};

export async function addExpenseToEnvelope(expenseId: number, envelopeId: number): Promise<any> {

  const url = `/api/addexp/${envelopeId}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ addExpenseId: expenseId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      const errorMessage = errorData.error || errorData.message || 'Failed to add expense to envelope.';
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }

    const updatedEnvelope = await response.json();
    return updatedEnvelope;

  } catch (error) {
    console.error('Error adding expense to envelope:', error);
    throw error;
  }
}

export async function removeExpenseFromEnvelope(expenseId: number, envelopeId: number): Promise<any> {
  const url = `/api/remexp/${envelopeId}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ removeExpenseId: expenseId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      const errorMessage = errorData.error || errorData.message || 'Failed to remove expense from envelope.';
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }

    const updatedEnvelope = await response.json();
    console.log(`Expense ${expenseId} successfully removed from Envelope ${envelopeId}.`, updatedEnvelope);
    return updatedEnvelope;

  } catch (error) {
    console.error('Error removing expense from envelope:', error);
    throw error;
  }
}