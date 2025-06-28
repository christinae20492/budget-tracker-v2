import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session or user ID.' });
  }

  try {
    const [expenses, envelopes, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: { userId: userId },
        orderBy: { date: 'desc' }, 
      }),
      prisma.envelope.findMany({
        where: { userId: userId },
      }),
      prisma.income.findMany({
        where: { userId: userId },
        orderBy: { date: 'desc' },
      }),
    ]);

    const allUserData = {
      expenses,
      envelopes,
      incomes,
    };

    return res.status(200).json(allUserData);

  } catch (error) {
    console.error('Error fetching all user data:', error);
    return res.status(500).json({ error: 'An unexpected server error occurred while fetching your data.' });
  } 
}