import React from 'react';
import logo from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { name, setName } = useTheme();
  return (
    <div className="bg-(--color-primary) px-6 py-3 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3  ms-4">
          <img src={logo} alt="logo" className="w-10 h-12" />
          <h1 className="text-2xl font-semibold text-gray-800">CRM-UI</h1>
        </div>
        <div className="flex items-center bg-(--color-primary-overlay) rounded-full p-1">
          <button
            onClick={() => setName('default')}
            className={`px-3 py-1 rounded-full text-sm ${name === 'default' ? 'bg-white text-(--color-primary-dark)' : 'text-white hover:bg-(--color-primary-overlay-hover)'}`}
            aria-pressed={name === 'default'}
          >
            Default
          </button>
          <button
            onClick={() => setName('sompo')}
            className={`px-3 py-1 rounded-full text-sm ${name === 'sompo' ? 'bg-white text-(--color-primary-dark)' : 'text-white hover:bg-(--color-primary-overlay-hover)'}`}
            aria-pressed={name === 'sompo'}
          >
            Sompo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
