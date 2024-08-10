'use client';
import { Website } from '@prisma/client';
import { DropdownMenuContent, DropdownMenuGroup } from '@/ui/dropdown-menu';
import { DropdownMenuPortal } from '@radix-ui/react-dropdown-menu';
import { deleteWebsite } from '@/actions/websites/delete';
import { toast } from 'sonner';
import { useAppDispatch } from '@/utils/index';
import { removeWebsite, setSavingState } from '@/store/slices/website-store';
import { useMutation } from '@tanstack/react-query';

/**
 * This needs to allow the user to:
 *
 * - open in a new tab(?)
 * - delete the site
 * - preview the site
 * - go to the edit page
 * - favorite the site(?)
 */
export default function WebsiteCardModal({ website }: { website: Website }) {
  const dispatch = useAppDispatch();

  const {
    data,
    mutateAsync: server_deleteWebsite,
    isPending,
    isError
  } = useMutation({
    mutationFn: (websiteId: string) => {
      dispatch(setSavingState('saving'));
      return deleteWebsite(websiteId)
    },
    onSuccess: (data) => {
      // update the local copy of the sites
      dispatch(removeWebsite(website));
      // close the modal
      dispatch(setSavingState('idle'));
      // success toast
      toast.success('Website deleted successfully');
    },
    onError: (e) => {
      console.error(e);
      dispatch(setSavingState('error'));
      toast.error(
        'An error occurred while deleting the website. Please try again or contact support.'
      );
    }
  })

  const dropdownItems = [
    {
      label: 'Open in new tab',
      onClick: () => {
        window.open(`/site/${website.websiteId}`, '_blank');
      },
      isButton: true
    },
    {
      label: 'Preview',
      onClick: () => {
        console.log('Preview');
      },
      isButton: true
    },
    {
      label: 'Edit',
      onClick: () => {
        console.log('Edit');
      },
      isButton: true
    },
    {
      label: 'Favourite',
      onClick: () => {
        console.log('Favorite');
      },
      isButton: true
    },
    {
      label: 'Delete',
      onClick: async () => {
        await server_deleteWebsite(website.websiteId);
      },
      isButton: true
    }
  ];

  return (
    <DropdownMenuPortal>
      <DropdownMenuContent
        className="bg-black border border-black-50 text-xs text-white"
        sideOffset={5}
        side="bottom"
        align="end"
        onClick={(e) => e.preventDefault()}
      >
        {dropdownItems.map((item, index) => (
          <DropdownMenuGroup key={index}>
            {item.isButton ? (
              <button
                className="block p-2 hover:bg-black-75 w-full text-start"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ) : (
              <a
                target="_blank"
                className="block p-2 hover:bg-black-75 w-full text-start"
              >
                {item.label}
              </a>
            )}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenuPortal>
  );
}
