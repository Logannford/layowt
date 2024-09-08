import { prisma } from "@/utils/prisma";

export default async function deleteCanvas({
  canvasId
}: {
  canvasId: string;
}) {  
  if (!canvasId) throw new Error('No canvas ID specified');

  const response = await prisma.canvas.delete({
    where: {
      canvasId
    },
  });
  if (!response) throw new Error('Failed to delete canvas');

  return 'ok';
}