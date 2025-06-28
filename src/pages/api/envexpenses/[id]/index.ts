import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { Expense } from '@/app/utils/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Expense[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id: envelopeId } = req.query;

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session.' });
  }

  if (!envelopeId || typeof envelopeId !== 'string') {
    return res.status(400).json({ error: 'Envelope ID is required and must be a string.' });
  }

  try {

    const expenses = await prisma.expense.findMany({
      where: {
        envelopeId: envelopeId, 
        userId: userId,      
      },
      orderBy: {
        date: 'desc', 
      },
    });

    return res.status(200).json(expenses);

  } catch (error) {
    console.error(`Error fetching expenses for envelope ${envelopeId} (User: ${userId}):`, error);
    return res.status(500).json({ error: 'An unexpected server error occurred while fetching expenses.' });
  }
}
