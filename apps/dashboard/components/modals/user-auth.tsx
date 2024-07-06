'use client';
// react imports
import { useEffect, useState, useRef } from 'react';
//supabase
import { createClient } from '@/utils/supabase/client';
// use router as we are in a client component
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// type imports
import type { User } from '@supabase/supabase-js';

export default function UserAuthModal({
  currentUserObject
}: {
  currentUserObject: User | null;
}) {
  // TODO: CHECK IF THE EMAIL IS ALREADY AUTHED ON PAGE LOAD
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [showModal, setShowModal] = useState(true);

  // Effects TODO: LOOK INTO REFACTORING INTO REACT QUERY
  useEffect(() => {

    // check if the user is logged in
    // if the user is present, clear the URL of the waiting_for_auth query param
    if (currentUserObject && searchParams.get('waiting_for_auth')) {
      router.replace('/pricing', undefined);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    // create a subscription to the user object
    const channel = supabase
      .channel('User Email Authenticated')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `uid=eq.${searchParams.get('uid') ?? null}`
        },
        (payload) => {
          // @ts-expect-error
          if (payload.new.hasAuthenticatedEmail === true) {
            // hide the modal for now
            setShowModal(false);

            // remove the 'waiting_for_auth' query param
            router.replace('/login', undefined);

            // clear the userId cookie
          } else {
            setShowModal(true);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, pathname]);

  const [loading, setLoading] = useState(false);

  // variable to check if the user has just come from the sign up page
  const [hasSignedUp, setHasSignedUp] = useState(false);

  useEffect(() => {
    // Reset loading state when pathname changes
    setLoading(false);

    // let's set this as a cookie to avoid the user from seeing the modal again
    if (searchParams.get('uid')) {
      setHasSignedUp(true);
    }
  }, [pathname, searchParams]);

  // do not display the modal if the user is on the sign-up page
  if (
    pathname === '/sign-up' ||
    currentUserObject ||
    pathname === '/login' ||
    pathname === '/forgot-password'
  )
    return '';

  if (searchParams.get('access_token')) return '';

  return '';

  // return isClient && currentUserObject === null ? (
  //   <Dialog
  //     modal={true}
  //     defaultOpen={true}
  //     open={showModal}
  //   >
  //     <Toaster
  //       richColors
  //       closeButton
  //       className="z-[100] group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto"
  //     />
  //     <DialogContent
  //       hidden={false}
  //       className="bg-black-100 border-2 border-black-200 rounded-lg max-w-[23rem] py-8"
  //       showCloseButton={false}
  //     >
  //       {hasSignedUp ? (
  //         <WaitingForAuth supabase={supabase} />
  //       ) : (
  //         <div className="flex flex-col gap-y-3 items-center text-white">
  //           <h2 className="text-3xl font-bold text-center">
  //             You need to log in
  //           </h2>
  //           <p className="text-center">Click the button below to log in.</p>
  //           <Button
  //             className="border border-white w-fit px-6 bg-black"
  //             onClick={() => {
  //               setLoading(true);
  //               router.push('/sign-up');
  //             }}
  //           >
  //             {loading ? (
  //               <ReloadIcon className="w-3 h-3 animate-spin" />
  //             ) : (
  //               'Log in'
  //             )}
  //           </Button>
  //         </div>
  //       )}
  //     </DialogContent>
  //   </Dialog>
  // ) : null;
}
