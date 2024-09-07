'use server'
import { prisma } from '@/utils/prisma';
import { supabase } from '@/lib/supabase';
import { revalidateTag } from 'next/cache';
import deleteCanvas from '@/actions/canvas/delete';

/**
 * 
 * Function to delete a website via its id
 * 
 * @param websiteId 
 * @returns 'ok'
 */
export const deleteWebsite = async (opts: {
	websiteId: string,
}) => {
	const { websiteId } = opts;
	// get the user uid trying to delete the site

	// check if we have any pages associated with the canvas
	const websitePages = await prisma.page.findMany({
		where: {
			canvasId: websiteId
		}
	});

	// if we have pages, delete them
	if (websitePages.length > 0) {
		await prisma.page.deleteMany({
			where: {
				canvasId: websiteId
			}
		});
	}

	// then delete the associated canvas
	await deleteCanvas({ canvasId: websiteId });

	// then delete the site from the db
	await prisma.website.delete({
		where: {
			websiteId
		}
	})

	// TODO: CHANGE HOW WE UPLOAD USER FILES - MAKE THERE OWN BUCKET PER USER 
	// SO WE CAN EMPTY THE BUCKET, THEN DELETE THE BUCKET WHEN THE
	// USER DELETES THE SITE
	const websiteUploads = await supabase.storage.from('user-sites').list();

	// delete the site's files from the storage
	const websiteFiles = websiteUploads.data.filter((file) => file.name.includes(websiteId));

	websiteFiles.forEach(async (file) => {
		await supabase.storage.from('websites').remove([file.name]);
	});

	// god. send. 🤩.
	revalidateTag('websites');
	// revalidatePath('/dashboard');
	return 'ok'
}