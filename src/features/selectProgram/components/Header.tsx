import React from 'react';

import logoAspen from '@/assets/logo-aspen.png';
import logoSompo from '@/assets/logo-sompo.png';
import { ThemeToggler } from '@/components/common';
import { useTheme } from '@/app/providers/ThemeProvider';

const Header: React.FC = () => {
  const { name } = useTheme();
  return (
    <div className="px-6 py-3 mb-8">
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-3  ms-4">
          <img
            src={name === 'default' ? logoAspen : logoSompo}
            alt="logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-semibold text-(--color-primary-dark)">
            RMS-UI
          </h1>
        </div>
        <ThemeToggler />
      </div>
    </div>
  );
};

export default Header;
