import React from 'react';
import logo from '../../assets/logo.png';

const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-8 ms-4">
      <img src={logo} alt="logo" className="w-10 h-12" />
      <h1 className="text-2xl font-semibold text-gray-800">CRM-UI</h1>
    </div>
  );
};

export default Header;
