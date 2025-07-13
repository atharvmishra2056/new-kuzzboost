import React, { createContext, useState, useContext, ReactNode } from 'react';

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    getSymbol: () => string;
    convert: (amountInInr: number) => string;
}

const exchangeRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095
};

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>('INR');

    const getSymbol = () => currencySymbols[currency];

    const convert = (amountInInr: number) => {
        const rate = exchangeRates[currency];
        const convertedAmount = amountInInr * rate;
        return convertedAmount.toFixed(2);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, getSymbol, convert }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};