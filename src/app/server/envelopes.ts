import { useSession } from "next-auth/react";
import { failToast, successToast, warnToast } from "../utils/toast";
import router from "next/router";
import { EditEnvelope, Envelope, Expense } from "../utils/types";


export const getAllEnvelopes = async (session: any, status: string): Promise<Envelope[] | undefined> => {
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
    
    const response = await fetch("/api/envelopes");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch notes.");
    }

    const data: Envelope[] = await response.json();
    successToast("Envelopes loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching envelopes:", err);
    failToast(err.message || "Error loading envelopes.");
    return undefined;
  }
};

export const getEnvelopeExpenses = async (id: string, session: any, status: string): Promise<Expense[] | undefined> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to view your envelope's expenses.");
    return;
  }

  try {
    const response = await fetch(`/api/envexpenses/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch expenses.");
    }

    const data: Expense[] = await response.json();
    successToast("Expenses loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching expenses:", err);
    failToast(err.message || "Error loading expenses.");
    return undefined;
  }
};

export const createEnvelope = async (
  env: Envelope,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to create notes.");
    return false;
  }

  if (!env.title.trim()) {
    warnToast("Title cannot be empty.");
    return false;
  }

  const envData = env;

  try {
    const response = await fetch("/api/envelopes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      successToast(result.message || "Envelope created successfully!");
      return true;
    } else {
      failToast(result.message || "Failed to create envelope. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error creating envelope:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const deleteEnvelope = async (id: string, session: any, status: string): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to delete envelope.");
    return false;
  }

  if (!id) {
    warnToast("Envelope ID is required for deletion.");
    return false;
  }

  try {
    const response = await fetch(`/api/envelopes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        successToast(result.message || "Envelope deleted successfully!");
      } else {
        successToast("Envelope deleted successfully!");
      }
      return true;
    } else {
      const errorResult = await response.json();
      failToast(errorResult.message || "Failed to delete envelope. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error deleting envelope:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const updateEnvelope = async (
  envelopeId: string,
  updateData: EditEnvelope,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to update envelopes.");
    return false;
  }

  if (!envelopeId) {
    warnToast("Envelope ID is required for update.");
    return false;
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    warnToast("No update data provided.");
    return false;
  }

  try {
    const response = await fetch(`/api/envelopes/${envelopeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) { 
      successToast(result.message || "Envelope updated successfully!");
      return true; 
    } else {
      failToast(result.message || "Failed to update envelope. Please try again.");
      return false; 
    }
  } catch (error) {
    console.error("Client-side error updating envelope:", error);
    failToast("An unexpected error occurred while updating envelope.");
    return false;
  }
};