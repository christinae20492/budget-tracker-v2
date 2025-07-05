import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/app/prisma';
import bcryptjs from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    console.warn('API: Unauthorized attempt to delete user (no session).');
    return res.status(401).json({ message: 'Unauthorized: No active session.' });
  }

  const userIdFromSession = session.user.id;
  const { id: userIdToDelete } = req.query;

  if (typeof userIdToDelete !== 'string' || userIdFromSession !== userIdToDelete) {
    console.warn(`API: Unauthorized attempt to delete user ID ${userIdToDelete} by user ${userIdFromSession}.`);
    return res.status(403).json({ message: 'Forbidden: You can only delete your own account.' });
  }

  if (req.method === 'DELETE') {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required for account deletion confirmation.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userIdFromSession },
        select: { password: true },
      });

      if (!user || !user.password) {
        console.error(`API: User ${userIdFromSession} not found or no password set during deletion attempt.`);
        return res.status(404).json({ message: 'User not found or password not set.' });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        console.warn(`API: Invalid password provided for user ${userIdFromSession} deletion.`);
        return res.status(401).json({ message: 'Invalid password. Account deletion failed.' });
      }

      await prisma.user.delete({
        where: { id: userIdFromSession },
      });

      console.log(`API: User ${userIdFromSession} and all associated data deleted successfully.`);
      return res.status(200).json({ message: 'Account and all associated data deleted successfully.' });

    } catch (error: any) {
      console.error(`API: Error deleting user ${userIdFromSession}:`, error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.status(500).json({ message: 'Internal server error during account deletion.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}