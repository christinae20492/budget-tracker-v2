import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/prisma";
import { Resend } from "resend";
import React from "react";
import WeeklyBudgetUpdateEmail from "@/app/server/emails/weeklyupdate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      startDate,
      endDate,
      totalExpenses,
      totalIncome,
      netBalance,
      envelopesSummary,
    } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const testid = "fe9aca7b-53c4-438e-bc23-c807c70ecdca";

    const user = await prisma.user.findUnique({
      where: { id: testid },
      select: { id: true, email: true, username: true },
    });

    if (!user) return;

    const appName = process.env.NEXT_PUBLIC_APP_NAME || "MyApp";

    await resend.emails.send({
      from: `"${appName} Updates" <updates@justabit.app>`,
      to: user.email,
      subject: `Just A Bit | ${user.username}'s Weekly Review`,
      react: React.createElement(WeeklyBudgetUpdateEmail, {
        username: user.username,
        startDate,
        endDate,
        totalIncome,
        totalExpenses,
        netBalance,
        envelopesSummary,
        appName,
      }),
    });

    return res.status(200).json({ success: true, message: `Sent to users.` });
  } catch (error) {
    console.error("Error sending feature emails:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
