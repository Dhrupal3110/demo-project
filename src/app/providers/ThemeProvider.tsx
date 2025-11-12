import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeName = 'default' | 'sompo';
interface ThemeContextType {
  mode: ThemeMode;
  name: ThemeName;
  toggleMode: () => void;
  setName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem('themeMode') as ThemeMode) || 'light'
  );
  const [name, setNameState] = useState<ThemeName>(
    (localStorage.getItem('themeName') as ThemeName) || 'default'
  );

  useEffect(() => {
    const root = document.documentElement;
    // apply dark/light
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // apply theme name class
    if (name === 'sompo') {
      root.classList.add('theme-sompo');
    } else {
      root.classList.remove('theme-sompo');
    }
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('themeName', name);
  }, [mode, name]);

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');
  const setName = (newName: ThemeName) => setNameState(newName);

  return (
    <ThemeContext.Provider value={{ mode, name, toggleMode, setName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
