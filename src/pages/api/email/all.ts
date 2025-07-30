import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/prisma';
import { Resend } from 'resend';
import { NewFeaturesEmail } from '@/app/server/emails/appupdate';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Just A Bit';
const RESEND_DOMAIN = process.env.RESEND_DOMAIN || 'justabit.app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!session || !session.user || !session.user.isAdmin) {
    console.error("Authorization failed: User is not authenticated or not an admin.");
    return res.status(403).json({ message: "Unauthorized: Admin privileges required." });
  }

  try {
    const { updateTitle, featuresList } = req.body;

    if (!updateTitle || !featuresList) {
      return res.status(400).json({ error: 'Missing required fields (updateTitle, featuresList).' });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true },
    });

    if (users.length === 0) {
      return res.status(200).json({ success: true, message: 'No users found to send emails to.' });
    }

    const emailPromises = users.map(async (user) => {
      if (!user.email || typeof user.email !== 'string' || user.email.length === 0) {
        console.warn(`Skipping email for user ID ${user.id}: Invalid or missing email address.`);
        return { status: 'rejected', reason: 'Invalid or missing email', email: user.email, userId: user.id };
      }

      try {
        const sendResult = await resend.emails.send({
          from: `"Just A Bit Updates" <updates@justabit.app>`,
          to: user.email,
          subject: updateTitle,
          react: React.createElement(NewFeaturesEmail, {
            username: user.username || 'Valued User',
            appName: APP_NAME,
            updateTitle,
            featuresList,
          }),
        });

        console.log(`Email sent successfully to ${user.email}. Resend ID: ${sendResult.data?.id}`);
        return { status: 'fulfilled', value: sendResult, email: user.email, userId: user.id };
      } catch (sendError: any) {
        console.error(`Failed to send email to ${user.email}:`, sendError);
        return { status: 'rejected', reason: sendError.message || 'Unknown send error', email: user.email, userId: user.id };
      }
    });

    const results = await Promise.allSettled(emailPromises);

    let successfulSends = 0;
    let failedSends = 0;
    const failedEmails: { email: string | null; userId: string; reason: string }[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        successfulSends++;
      } else {
        failedSends++;
        failedEmails.push({
          email: result.reason.email,
          userId: result.reason.userId,
          reason: result.reason.reason,
        });
      }
    });

    console.log(`--- Email Dispatch Summary ---`);
    console.log(`Total users processed: ${users.length}`);
    console.log(`Successfully sent: ${successfulSends}`);
    console.log(`Failed to send: ${failedSends}`);
    if (failedEmails.length > 0) {
      console.error('Details of failed sends:', failedEmails);
    }
    console.log(`------------------------------`);

    return res.status(200).json({
      success: true,
      message: `Email dispatch completed. ${successfulSends} successful, ${failedSends} failed.`,
      successfulSends,
      failedSends,
      failedEmails,
    });

  } catch (error) {
    console.error('Unhandled error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error during email dispatch.' });
  }
}