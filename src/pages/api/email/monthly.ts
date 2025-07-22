import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/prisma';
import { Resend } from 'resend';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import MonthlyBudgetUpdateEmail from '@/app/server/emails/monthlyupdate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!session) return;
  const isAdmin = session.user.isAdmin;
  if (!isAdmin) {
    console.error("This user is not authorized to access all users.");
    return res.status(400).json({ message: "User ID missing from session." });
  }

  try {
    const { userId, startDate, endDate, totalIncome, totalExpenses, netBalance, envelopesSummary } = req.body;
 

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Could not find user ' + {userId} });
    }

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'MyApp';

      await resend.emails.send({
        from: `"${appName} Monthly Update for ${user.username}" <updates@justabit.app>`,
        to: user.email!,
        subject: `Your Monthly Budget Update for ${appName}`,
        react: React.createElement(MonthlyBudgetUpdateEmail, {
          username: user.username,
          startDate,
          endDate,
          totalIncome: totalIncome.toFixed(2),
          totalExpenses:totalExpenses.toFixed(2),
          netBalance: netBalance.toFixed(2),
          envelopesSummary,
          appName,
        }),
      });

    return res.status(200).json({ success: true, message: `Sent to opted-in user ` + {userId} });
  } catch (error) {
    console.error('Error sending monthly budget emails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}