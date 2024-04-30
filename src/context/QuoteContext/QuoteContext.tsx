import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuoteType, ServiceQuoteType } from 'src/components';

interface QuoteContextType {
  quoteSelected: QuoteType | undefined;
  setNewQuoteSelected: (quote: QuoteType | undefined) => void;
  serviceQuoteSelected: ServiceQuoteType | undefined;
  setServiceQuoteSelected: React.Dispatch<React.SetStateAction<ServiceQuoteType | undefined>>;
  setNewServiceQuoteSelected: (quote: ServiceQuoteType | undefined) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};

interface QuoteProviderProps {
  children: ReactNode;
}

export const QuoteProvider = ({ children }: QuoteProviderProps) => {
  const [quoteSelected, setQuoteSelected] = useState<QuoteType | undefined>(undefined)
  const [serviceQuoteSelected, setServiceQuoteSelected] = useState<ServiceQuoteType | undefined>(undefined)

  const setNewQuoteSelected = (quote: QuoteType | undefined) => {
    setQuoteSelected(quote)
  }

  const setNewServiceQuoteSelected = (serviceQuote: ServiceQuoteType | undefined) => {
    setServiceQuoteSelected(serviceQuote)
  }

  return (
    <QuoteContext.Provider value={{ quoteSelected, setNewQuoteSelected, serviceQuoteSelected, setNewServiceQuoteSelected, setServiceQuoteSelected }}>
      {children}
    </QuoteContext.Provider>
  );
};
