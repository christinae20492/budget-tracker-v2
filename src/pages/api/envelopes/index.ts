import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/app/prisma";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

import { Envelope, NewEnvelope } from "@/app/utils/types";
import { NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req, res, authOptions: authOptions });

  if (!session) {
    console.warn(`API: Unauthorized attempt to ${req.method} envelope (no session).`);
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
      console.log(`API: User ${userId} is requesting all envelopes.`);
      try {
        const getEnvelopes: Envelope[] = await prisma.envelopes.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            title: 'desc',
          },
        });
        return res.status(200).json(getEnvelopes);
      } catch (error) {
        console.error("API: Error fetching envelopes:", error);
        return res.status(500).json({ message: 'Internal server error while fetching envelopes.' });
      }

    case 'POST':
      console.log(`API: User ${userId} is attempting to create an envelope.`);
      const { title, fixed, budget, expenses, icon, color, comments } = req.body;

      if (!title || !budget) {
        return res.status(400).json({ message: 'Required fields missing' });
      }

      try {
        const newEnvelope: NewEnvelope = await prisma.expense.create({
          data: {
            id: Date.now(),
            title: title,
            fixed: fixed,
            budget: budget,
            expenses: expenses,
            comments: comments,
            icon:icon,
            color:color,
            userId: userId,
          },
        });
        return res.status(201).json({ message: 'Envelope created successfully!', envelope: newEnvelope });
      } catch (error) {
        console.error("API: Error creating envelope:", error);
        return res.status(500).json({ message: 'Failed to create envelope.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}