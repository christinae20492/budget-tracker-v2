import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/app/prisma';
import { Note, EditNote } from '@/app/utils/types'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

      const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.warn(`API: Unauthorized attempt to move note (no session).`);
    return res.status(401).json({ message: 'Unauthorized: No active session.' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Note ID is required and must be a string.' });
  }

  const noteId = Array.isArray(id) ? id[0] : id;

    const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: 'User ID missing from session.' });
  }


  try {
    if (req.method === 'GET') {
      const note = await prisma.note.findUnique({
        where: { id: noteId,
            userId: userId,
         },
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found.' });
      }

      return res.status(200).json(note);

    }

    else if (req.method === 'PATCH') {
      const updateData: EditNote = req.body;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No update data provided.' });
      }

      const existingnote = await prisma.note.findUnique({
        where: { id: noteId,
            userId: userId
         },
      });

      if (!existingnote) {
        return res.status(404).json({ error: 'Note not found.' });
      }

      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== null)
      );

      const updatednote = await prisma.note.update({
        where: { id: noteId,
            userId: userId
         },
        data: filteredData,
      });

      return res.status(200).json(updatednote);

    }

    else if (req.method === 'DELETE') {
      const existingnote = await prisma.note.findUnique({
        where: { id: noteId,
            userId: userId
         },
      });

      if (!existingnote) {
        return res.status(404).json({ error: 'Note not found.' });
      }

      await prisma.note.delete({
        where: { id: noteId },
      });

      return res.status(204).end();

    }

    else {
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`API Error for note ID ${noteId}:`, error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
}