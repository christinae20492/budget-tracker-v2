import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/app/prisma";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

import { Note, NewNote } from "@/app/utils/types";
import { NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req, res, authOptions: authOptions });

  if (!session) {
    console.warn(`API: Unauthorized attempt to ${req.method} notes (no session).`);
        console.log(req.headers)
    return res.status(401).json({ message: 'Unauthorized: No active session.' });
  }

  const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: 'User ID missing from session.' });
  }

  switch (req.method) {
    case 'GET':
      console.log(`API: User ${userId} is requesting all notes.`);
      try {
        const getNotes: Note[] = await prisma.notes.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            content: 'desc',
          },
        });
        return res.status(200).json(getNotes);
      } catch (error) {
        console.error("API: Error fetching notes:", error);
        return res.status(500).json({ message: 'Internal server error while fetching notes.' });
      }

    case 'POST':
      console.log(`API: User ${userId} is attempting to create an expense.`);
      const { month, content } = req.body;

      if (!month || !content) {
        return res.status(400).json({ message: 'Required fields missing' });
      }

      try {
        const newNote: NewNote = await prisma.note.create({
          data: {
            id: Date.now(),
            month: month,
            content: content,
            userId: userId,
          },
        });
        return res.status(201).json({ message: 'Note created successfully!', note: newNote });
      } catch (error) {
        console.error("API: Error creating note:", error);
        return res.status(500).json({ message: 'Failed to create note.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}