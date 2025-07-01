import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/app/prisma";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

import { Expense, NewExpense } from "@/app/utils/types";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.warn(`API: Unauthorized ${req.method} (no session).`);
    console.log(req.headers);
    return res
      .status(401)
      .json({ message: "Unauthorized: No active session." });
  }

  const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: "User ID missing from session." });
  }

  try {
  switch (req.method) {
    case "GET":
      console.log(`API: User ${userId} is requesting all expenses.`);
      try {
        const getExpenses = await prisma.expense.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            location: "desc",
          },
        });
        return res.status(200).json(getExpenses);
      } catch (error) {
        console.error("API: Error fetching notes:", error);
        return res
          .status(500)
          .json({ message: "Internal server error while fetching notes." });
      }

    case "POST":
      console.log(`API: User ${userId} is attempting to create an expense.`);
      const { location, envelope, date, amount, comments, envelopeId } =
        req.body;

      if (!location || !amount) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.warn(`API: Invalid amount received: ${amount}`);
            return res.status(400).json({ message: "Amount must be a positive number." });
        }

      const existingEnvelope = await prisma.envelope.findUnique({
        where: { id: envelopeId, userId: userId },
      });

      if (!existingEnvelope) {
        return res
          .status(404)
          .json({ error: "Envelope not found or does not belong to user." });
      }

      try {
        const newExpense = await prisma.expense.create({
          data: {
            id: uuidv4(),
            location: location,
            date: date,
            amount: parsedAmount,
            comments: comments,
            envelope: {
              connect: {
                id: envelopeId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
        console.log(`Creating..., ${newExpense}`)
        return res.status(201).json({
          message: "Expense created successfully!",
          expense: newExpense,
        });
      } catch (error) {
        console.error("API: Error creating expense:", error);
        return res.status(500).json({ message: "Failed to create expense." });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
  }
  } catch (error: any) {
    console.error("API: Unhandled error in handler:", error);
    return res.status(500).json({ message: "An unexpected server error occurred." });
  }
}
