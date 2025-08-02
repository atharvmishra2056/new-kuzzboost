import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { theme, darkTheme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Force light theme and remove all theme-switching logic
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
    setResolvedTheme('light');
  }, []);

  const toggleTheme = () => {
    // Theme toggling is disabled
  };

  const currentTheme = theme;

  return (
    <ThemeContext.Provider 
      value={{
        mode: 'light',
        setMode: () => {},
        resolvedTheme,
        toggleTheme,
      }}
    >
      <MUIThemeProvider theme={currentTheme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
