import { render, screen, act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Helper component to consume context
const TestComponent = () => {
  const { mode, name, toggleMode, setName } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="name">{name}</span>
      <button onClick={toggleMode}>Toggle Mode</button>
      <button onClick={() => setName('sompo')}>Set Sompo</button>
      <button onClick={() => setName('default')}>Set Default</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  test('renders children', () => {
    render(
      <ThemeProvider>
        <div>Child Content</div>
      </ThemeProvider>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('provides default values', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(screen.getByTestId('name')).toHaveTextContent('default');
  });

  test('loads values from localStorage', () => {
    localStorage.setItem('themeMode', 'dark');
    localStorage.setItem('themeName', 'sompo');
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('name')).toHaveTextContent('sompo');
  });

  test('toggles mode and updates document class', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByText('Toggle Mode');
    
    // Initial state
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark
    act(() => {
      toggleBtn.click();
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('themeMode')).toBe('dark');

    // Toggle back to light
    act(() => {
      toggleBtn.click();
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('themeMode')).toBe('light');
  });

  test('sets theme name and updates document class', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const sompoBtn = screen.getByText('Set Sompo');
    const defaultBtn = screen.getByText('Set Default');

    // Initial state
    expect(document.documentElement.classList.contains('theme-sompo')).toBe(false);

    // Set to sompo
    act(() => {
      sompoBtn.click();
    });
    expect(screen.getByTestId('name')).toHaveTextContent('sompo');
    expect(document.documentElement.classList.contains('theme-sompo')).toBe(true);
    expect(localStorage.getItem('themeName')).toBe('sompo');

    // Set back to default
    act(() => {
      defaultBtn.click();
    });
    expect(screen.getByTestId('name')).toHaveTextContent('default');
    expect(document.documentElement.classList.contains('theme-sompo')).toBe(false);
    expect(localStorage.getItem('themeName')).toBe('default');
  });

  test('useTheme throws error outside provider', () => {
    // Suppress console.error for this test as React logs errors when boundary catches
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used inside ThemeProvider');

    console.error = originalError;
  });
});
