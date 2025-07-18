import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/app/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id || !session.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }

  const userId = req.query.id;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid userId.' });
  }

  try {
    const incomes = await prisma.income.findMany({
      where: { userId: userId },
      select: {
        id: true,
        amount: true,
        savings: true,
        investments: true,
        date: true,
      },
    });

    const expenses = await prisma.expense.findMany({
      where: { userId: userId },
      select: {
        id: true,
        amount: true,
        location: true,
        envelopeId: true,
        date: true,
      },
    });

    const envelopes = await prisma.envelope.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
      },
    });

    return res.status(200).json({ incomes, expenses, envelopes });

  } catch (error) {
    console.error(`Error fetching financial data for user ${userId}:`, error);
    return res.status(500).json({ message: 'Internal server error while fetching financial data.' });
  }
}