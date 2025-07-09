import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/app/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.warn(`API: Unauthorized attempt to move income (no session).`);
    return res
      .status(401)
      .json({ message: "Unauthorized: No active session." });
  }

  const userId = session.user.id;
  if (!userId) {
    console.error("API: User ID not found in session for authenticated user.");
    return res.status(400).json({ message: "User ID missing from session." });
  }

  if (req.method === "PATCH") {
    const data = req.body;
   
    if (!data) {
      return res
        .status(400)
        .json({
          message: "No update data provided.",
        });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: data,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(`API Error for updating user preferences`, error);
      return res
        .status(500)
        .json({ error: "An unexpected server error occurred." });
    }
  }
}
