import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/app/prisma';
import { Income, EditIncome } from '@/app/utils/types'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

      const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.warn(`API: Unauthorized attempt to move income (no session).`);
    return res.status(401).json({ message: 'Unauthorized: No active session.' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Income ID is required and must be a string.' });
  }

  const incomeId = Array.isArray(id) ? id[0] : id;

    const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: 'User ID missing from session.' });
  }


  try {
    if (req.method === 'GET') {
      const income = await prisma.income.findUnique({
        where: { id: incomeId,
            userId: userId,
         },
      });

      if (!income) {
        return res.status(404).json({ error: 'Income not found.' });
      }

      return res.status(200).json(income);

    }

    else if (req.method === 'PATCH') {
      const updateData: EditIncome = req.body;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No update data provided.' });
      }

      const existingincome = await prisma.income.findUnique({
        where: { id: incomeId,
            userId: userId
         },
      });

      if (!existingincome) {
        return res.status(404).json({ error: 'Income not found.' });
      }

      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== null)
      );

      const updatedincome = await prisma.income.update({
        where: { id: incomeId,
            userId: userId
         },
        data: filteredData,
      });

      return res.status(200).json(updatedincome);

    }

    else if (req.method === 'DELETE') {
      const existingincome = await prisma.income.findUnique({
        where: { id: incomeId,
            userId: userId
         },
      });

      if (!existingincome) {
        return res.status(404).json({ error: 'Income not found.' });
      }

      await prisma.income.delete({
        where: { id: incomeId },
      });

      return res.status(204).end();

    }

    else {
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`API Error for income ID ${incomeId}:`, error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
}