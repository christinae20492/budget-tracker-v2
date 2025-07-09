import { useSession } from "next-auth/react";
import { failToast, successToast, warnToast } from "../utils/toast";
import router from "next/router";
import { EditNote, Note } from "../utils/types";


export const getAllNotes = async (session: any, status: string): Promise<Note[] | undefined> => {
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
    
    const response = await fetch("/api/notes");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch notes.");
    }

    const data: Note[] = await response.json();
    //successToast("Notes loaded successfully!");
    return data;
  } catch (err: any) {
    console.error("Error fetching notes:", err);
    failToast(err.message || "Error loading notes.");
    return undefined;
  }
};

export const createNote = async (
  month: number,
  content: string,
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

  if (!content.trim()) {
    warnToast("Body cannot be empty.");
    return false;
  }

  const noteData = {
    month,
    content
  };

  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      successToast(result.message || "Note created successfully!");
      return true;
    } else {
      failToast(result.message || "Failed to create note. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error creating note:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const deleteNote = async (id: string, session: any, status: string): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to delete note.");
    return false;
  }

  if (!id) {
    warnToast("Note ID is required for deletion.");
    return false;
  }

  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        successToast(result.message || "Note deleted successfully!");
      } else {
        successToast("Note deleted successfully!");
      }
      return true;
    } else {
      const errorResult = await response.json();
      failToast(errorResult.message || "Failed to delete note. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Client-side error deleting note:", error);
    failToast("An unexpected error occurred. Please try again.");
    return false;
  }
};

export const updateNote = async (
  noteId: string,
  updateData: EditNote,
  session: any,
  status: string
): Promise<boolean> => {
  if (status === "loading") {
    warnToast("Authentication status is still loading. Please wait.");
    return false;
  }

  if (status === "unauthenticated") {
    failToast("Please sign in to update notes.");
    return false;
  }

  if (!noteId) {
    warnToast("Note ID is required for update.");
    return false;
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    warnToast("No update data provided.");
    return false;
  }

  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) { 
      successToast(result.message || "Note updated successfully!");
      return true; 
    } else {
      failToast(result.message || "Failed to update note. Please try again.");
      return false; 
    }
  } catch (error) {
    console.error("Client-side error updating note:", error);
    failToast("An unexpected error occurred while updating note.");
    return false;
  }
};