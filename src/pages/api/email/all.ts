import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/prisma';
import { Resend } from 'resend';
import { NewFeaturesEmail } from '@/app/server/emails/appupdate';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

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
    const { updateTitle, featuresList, dashboardUrl } = req.body;
    if (!updateTitle || !featuresList || !dashboardUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true },
    });

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'MyApp';

    for (const user of users) {
      await resend.emails.send({
        from: `"${appName} Updates" <updates@${process.env.RESEND_DOMAIN}>`,
        to: user.email!,
        subject: updateTitle,
        react: React.createElement(NewFeaturesEmail, {
          username: user.username,
          appName,
          updateTitle,
          featuresList,
        }),
      });
    }

    return res.status(200).json({ success: true, message: `Sent to ${users.length} users.` });
  } catch (error) {
    console.error('Error sending feature emails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
