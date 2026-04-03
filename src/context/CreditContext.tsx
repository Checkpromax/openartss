import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface CreditContextType {
  credits: number;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(5); // Free tier starts with 5

  const deductCredits = useCallback((amount: number): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    return false;
  }, [credits]);

  const addCredits = useCallback((amount: number) => {
    setCredits(prev => prev + amount);
  }, []);

  return (
    <CreditContext.Provider value={{ credits, deductCredits, addCredits }}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (!context) throw new Error('useCredits must be used within CreditProvider');
  return context;
}
