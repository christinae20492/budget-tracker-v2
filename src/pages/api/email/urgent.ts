import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/prisma';
import { Resend } from 'resend';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import EmailServiceAlert from '@/app/server/emails/emailservice';

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

    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true },
    });

        const recipientEmails = users
      .map(user => user.email)
      .filter((email): email is string => typeof email === 'string' && email.length > 0);

    if (recipientEmails.length === 0) {
        return res.status(200).json({ success: true, message: 'No valid recipient emails found.' });
    }

      await resend.emails.send({
        from: `"Just A Bit" <noreply@justabit.app>`,
        to: recipientEmails,
        subject: "New Email Service",
        react: React.createElement(EmailServiceAlert, {
          username: 'Valued User',
        }),
      });

    return res.status(200).json({ success: true, message: `Sent to ${users.length} users.` });
  } catch (error) {
    console.error('Error sending feature emails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
