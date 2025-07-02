import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/prisma";
import { EditEnvelope } from "@/app/utils/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ error: "Envelope ID is required and must be a string." });
  }

  const envelopeId = Array.isArray(id) ? id[0] : id;

  try {
    if (req.method === "GET") {
      const envelope = await prisma.envelope.findUnique({
        where: { id: envelopeId, userId: userId },
      });

      if (!envelope) {
        return res.status(404).json({ error: "Envelope not found." });
      }

      return res.status(200).json(envelope);
    } else if (req.method === "PATCH") {
      const { addExpense, removeExpense, ...restOfUpdateData }: EditEnvelope =
        req.body;

      let dataToUpdate: any = restOfUpdateData;

      if (addExpense !== undefined || removeExpense !== undefined) {
        const currentEnvelope = await prisma.envelope.findUnique({
          where: { id: envelopeId, userId: userId },
          select: { expenses: true, userId: true },
        });

        if (!currentEnvelope) {
          return res
            .status(404)
            .json({ error: "Envelope not found for updating expenses." });
        }

        let updatedExpenses = currentEnvelope.expenses || [];

        if (addExpense !== undefined && typeof addExpense === "string") {
          if (!updatedExpenses.includes(addExpense)) {
            updatedExpenses = [...updatedExpenses, addExpense];
          } else {
            console.log(
              `Expense ID ${addExpense} is already linked to Envelope ID ${envelopeId}.`
            );
          }
        }

        if (removeExpense !== undefined && typeof removeExpense === "string") {
          const initialLength = updatedExpenses.length;
          updatedExpenses = updatedExpenses.filter(
            (id: any) => id !== removeExpense
          );
          if (updatedExpenses.length === initialLength) {
            console.log(
              `Expense ID ${removeExpense} not found in Envelope ID ${envelopeId}'s expenses.`
            );
          }
        }

        dataToUpdate.expenses = updatedExpenses;
      }

      const updatedEnvelope = await prisma.envelope.update({
        where: { id: envelopeId, userId: userId },
        data: dataToUpdate,
      });

      return res.status(200).json(updatedEnvelope);
    } else if (req.method === "DELETE") {
      const existingEnvelope = await prisma.envelope.findUnique({
        where: { id: envelopeId, userId: userId },
        select: { userId: true },
      });

      if (!existingEnvelope) {
        return res.status(404).json({ error: "Envelope not found." });
      }

      await prisma.envelope.delete({
        where: { id: envelopeId },
      });

      return res.status(204).end();
    } else {
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`API Error for Envelope ID ${envelopeId}:`, error);
    return res
      .status(500)
      .json({ error: "An unexpected server error occurred." });
  }
}
