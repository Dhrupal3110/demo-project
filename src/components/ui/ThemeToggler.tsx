import { useTheme } from '@/app/providers/ThemeProvider';

export const ThemeToggler = () => {
    const { name, setName } = useTheme();
  return (
    <div className="flex items-center bg-(--color-border) rounded-full p-1">
      <button
        onClick={() => setName('default')}
        className={`px-3 font-semibold py-1 rounded-full text-sm ${name === 'default' ? 'bg-(--color-surface) text-(--color-primary-dark)' : 'text-black hover:bg-(--color-primary-overlay-hover)'}`}
        aria-pressed={name === 'default'}
      >
        Aspen
      </button>
      <button
        onClick={() => setName('sompo')}
        className={`px-3 py-1 font-semibold rounded-full text-sm ${name === 'sompo' ? 'bg-(--color-surface) text-(--color-primary-dark)' : 'text-black hover:bg-(--color-primary-overlay-hover)'}`}
        aria-pressed={name === 'sompo'}
      >
        Sompo
      </button>
    </div>
  );
};
