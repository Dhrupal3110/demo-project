import React from 'react';

import logoAspen from '@/assets/logo-aspen.png';
import logoSompo from '@/assets/logo-sompo.png';
import { ThemeToggler } from '@/components/ui';
import { useTheme } from '@/app/providers/ThemeProvider';

const Header: React.FC = () => {
  const { name } = useTheme();
  return (
    <div className="container mx-auto pt-6 px-6 pt-3 mb-8">
      <div className=" flex items-center justify-between">
        <div className="flex items-center gap-3  ms-4">
          <img
            src={name === 'default' ? logoAspen : logoSompo}
            alt="logo"
            className="w-12 h-10"
          />
          <h1 className="text-2xl font-semibold text-(--color-primary-dark)">
            LYNX
          </h1>
        </div>
        <ThemeToggler />
      </div>
    </div>
  );
};

export default Header;
