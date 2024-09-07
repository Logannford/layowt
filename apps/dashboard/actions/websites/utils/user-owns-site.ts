'use server'
import { prisma } from '@/utils/prisma';

export const userOwnsWebsite = async (opts: {
  websiteId: string,
  userId: string,
}) => {
  const { websiteId, userId } = opts;

  const website = await prisma.website.findFirst({
    where: {
      websiteId,
      owner: {
        uid: userId
      }
    }
  });

  if (!website) {
    throw new Error('User does not own website');
  }

  return true;
}