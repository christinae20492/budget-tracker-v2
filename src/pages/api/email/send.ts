import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { to, subject, htmlContent, textContent } = req.body;

  if (!to || !subject || (!htmlContent && !textContent)) {
    return res.status(400).json({ message: 'Missing required email parameters (to, subject, htmlContent/textContent).' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Your App Name <onboarding@yourverifieddomain.com>',
      to: [to],
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    console.log('Email sent data:', data);

    if (data && data.id) {
      return res.status(200).json({ message: 'Email sent successfully!', emailId: data.id });
    } else {
      console.error('Resend did not return an ID:', data);
      return res.status(500).json({ message: 'Failed to send email: No ID returned.' });
    }
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      message: 'Failed to send email.',
      error: error.message || 'An unknown error occurred.',
      details: error.name
    });
  }
}