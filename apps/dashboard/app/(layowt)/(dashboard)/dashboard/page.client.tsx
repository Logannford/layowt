'use client';
import { useAppDispatch } from '@/utils/index';
import { setWebsite } from '@/store/slices/website-store';
import { getQueryParams } from '@layowt/utils/src/get-query-params'
import { toast } from 'sonner';
import { ERROR_CODES } from '@layowt/utils/src/constants/error-codes';
import { useRef } from 'react';

export default function PageClient({
  children
}: {
  children: React.ReactNode;
  }) {
  const dispatch = useAppDispatch();
  dispatch(setWebsite(null));
  const ranToast = useRef(false);

  // check if there in a query param in the URL
  // if there is, display either to correct toast
  // message or modal.
  const urlParams = getQueryParams({ keys: ['e'] });
  
  if (Object.keys(urlParams).length > 0 && !ranToast.current) { 
    toast.error(ERROR_CODES[urlParams.e]?.title ?? ERROR_CODES[urlParams.e], {
      description: ERROR_CODES[urlParams.e]?.description,
      duration: 5000,
      position: 'bottom-right',
    });
    ranToast.current = true;
  }

  return <>{children}</>;
}
