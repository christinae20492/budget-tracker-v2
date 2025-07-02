import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/app/prisma";
import { Expense, EditExpense } from "@/app/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.warn(`API: Unauthorized attempt to move expense (no session).`);
    return res
      .status(401)
      .json({ message: "Unauthorized: No active session." });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ error: "Expense ID is required and must be a string." });
  }

  const expenseId = Array.isArray(id) ? id[0] : id;

  const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: "User ID missing from session." });
  }

  try {
    if (req.method === "GET") {
      const expense = await prisma.expense.findUnique({
        where: { id: expenseId, userId: userId },
      });

      if (!expense) {
        return res.status(404).json({ error: "Expense not found." });
      }

      return res.status(200).json(expense);

    } else if (req.method === "PATCH") {
      const updateData: EditExpense = req.body;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No update data provided." });
      }

      const existingexpense = await prisma.expense.findUnique({
        where: { id: expenseId, userId: userId },
      });

      if (!existingexpense) {
        return res.status(404).json({ error: "Expense not found." });
      }

      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== null)
      );

      const updatedExpense = await prisma.expense.update({
        where: { id: expenseId, userId: userId },
        data: filteredData,
      });

      return res.status(200).json(updatedExpense);
      
    } else if (req.method === "DELETE") {
      const existingExpense = await prisma.expense.findUnique({
        where: { id: expenseId, userId: userId },
      });

      if (!existingExpense) {
        return res.status(404).json({ error: "Expense not found." });
      }

      await prisma.expense.delete({
        where: { id: expenseId },
      });

      return res.status(204).end();
    } else {
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`API Error for expense ID ${expenseId}:`, error);
    return res
      .status(500)
      .json({ error: "An unexpected server error occurred." });
  }
}
