import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded-lg border hover:bg-(--color-hover) transition"
      style={{ borderColor: 'var(--color-border)' }}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <Moon className="w-5 h-5 text-(--color-text)" />
      ) : (
        <Sun className="w-5 h-5 text-(--color-warning)" />
      )}
    </button>
  );
}
