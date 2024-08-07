'use client';
import { StripeProduct } from '@/types/StripeProduct';
import { experienceLevel } from '@prisma/client';
import { domAnimation, LazyMotion } from 'framer-motion';
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo, 
  useCallback 
} from 'react';

interface HashContextType {
  hash: string;
  setHash: (newHash: string) => void;
  userOnboardingDetails: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    experienceLevel: experienceLevel;
  };
  planContext: StripeProduct;
  setPlanContext: (newPlanContext: StripeProduct) => void;
}

export const HashContext = createContext<HashContextType | null>(null);

export const HashProvider = ({ children, ...props }) => {
  const [hash, setHashState] = useState('');
  const [planContext, setPlanContext] = useState<StripeProduct>();

  const userOnboardingDetails = useMemo(
    () => ({ 
      id: '',
      firstName: '', 
      lastName: '', 
      displayName: '',
      experienceLevel: experienceLevel.businessOwner
    }),[]);

  // method passed to the context to update the hash
  const setHash = useCallback((newHash: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = newHash;
      setHashState(newHash);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setHashState(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      hash,
      setHash,
      userOnboardingDetails,
      planContext,
      setPlanContext
    }),
    [hash, setHash]
  );

  return (
    <LazyMotion features={domAnimation}>
      <HashContext.Provider value={contextValue}>
        {children}
      </HashContext.Provider>
    </LazyMotion>
  );
};

// custom hook to use the context
export const useHashContext = () => useContext(HashContext);
