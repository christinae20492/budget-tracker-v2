import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/app/prisma";

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
      .json({ error: "User ID is required and must be a string." });
  }

  const user = Array.isArray(id) ? id[0] : id;

  const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: "User ID missing from session." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        darkMode: true,
        currency: true,
        optInEmails: true,
        language: true
      },
    });

      if (!user) {
        return res.status(404).json({ error: "Expense not found." });
      }

      return res.status(200).json(user);

    } catch (error) {
    console.error(`API Error for user ID ${user}:`, error);
    return res
      .status(500)
      .json({ error: "An unexpected server error occurred." });
  }
}