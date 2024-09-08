'use server'
import { prisma } from '@/utils/prisma';
import { supabase } from '@/lib/supabase';
import { revalidatePath, revalidateTag } from 'next/cache';
import deleteCanvas from '@/actions/canvas/delete';
import { userOwnsWebsite } from './utils/user-owns-site';
import { getUserFromSession } from '../user/get-user';

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

	// get the current user
	const user = (await getUserFromSession()).data.user;
	// if we do not have a user, we exit early with an error.
	if (!user) {
		throw new Error('No user found');
	}
	// check if the user owns the site
	const userOwnsSite = await userOwnsWebsite({
		websiteId,
		userId: user.id
	});

	// if the user does not own the site, we exit early with an error.
	if (!userOwnsSite) {
		throw new Error('User does not own website');
	}

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

	await prisma.website.delete({
		where: {
			websiteId,
			AND: {
				userId: user.id
			}
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
	revalidatePath('/dashboard');
	return 'ok'
}