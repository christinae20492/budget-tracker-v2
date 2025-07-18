import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/app/prisma";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.warn(
      `API: Unauthorized attempt to ${req.method} users (no session).`
    );
    console.log(req.headers);
    return res
      .status(401)
      .json({ message: "Unauthorized: No active session." });
  }

  const user = session.user;
  const isAdmin = session.user.isAdmin;
  if (!isAdmin) {
    console.error("This user is not authorized to access all users.");
    return res.status(400).json({ message: "User ID missing from session." });
  }

  switch (req.method) {
    case "GET":
      console.log(`API: User ${user.id} is requesting all users.`);
      try {
        const getUsers = await prisma.user.findMany({
           select: { id: true, email: true, username: true },
        });
        return res.status(200).json(getUsers);
      } catch (error) {
        console.error("API: Error fetching users:", error);
        return res
          .status(500)
          .json({ message: "Internal server error while fetching users." });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
  }
}
