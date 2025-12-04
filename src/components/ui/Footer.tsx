import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t  bg-(--color-primary)">
      <div className="px-6 mx-auto flex flex-col md:flex-row items-center justify-between py-4 text-sm text-(--color-primary-text)">
        {/* Left */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} RMS-UI. All rights reserved.
        </p>

        {/* Right links */}
        <div className="flex gap-6 mt-2 md:mt-0">
          <a href="#" className=" transition">
            Privacy Policy
          </a>
          <a href="#" className=" transition">
            Terms
          </a>
          <a href="#" className="transition">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
