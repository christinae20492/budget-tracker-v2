import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/app/prisma";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

import { Income, NewIncome } from "@/app/utils/types";
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
      console.log(`API: User ${userId} is requesting all incomes.`);
      try {
        const getIncomes: Income[] = await prisma.income.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            source: 'desc',
          },
        });
        return res.status(200).json(getIncomes);
      } catch (error) {
        console.error("API: Error fetching incomes:", error);
        return res.status(500).json({ message: 'Internal server error while fetching incomes.' });
      }

    case 'POST':
      console.log(`API: User ${userId} is attempting to create an income.`);
      const { source, amount, date, savings, investments, remainder } = req.body;

      if (!source || !amount) {
        return res.status(400).json({ message: 'Required fields missing' });
      }

      try {
        const newIncome: NewIncome = await prisma.income.create({
          data: {
            id: Date.now(),
            source: source,
            savings: savings,
            date: date,
            amount: amount,
            investments: investments,
            remainder: remainder,
            userId: userId,
          },
        });
        return res.status(201).json({ message: 'Income created successfully!', income: newIncome });
      } catch (error) {
        console.error("API: Error creating income:", error);
        return res.status(500).json({ message: 'Failed to create income.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}